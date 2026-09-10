import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { TenantLink as Link } from '@/components/TenantLink';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Message, Profile } from '@/types/database';

export default function EventChatPage() {
  const { eventId, otherProfileId } = useParams<{ eventId: string; otherProfileId: string }>();
  const { user, profile, isLoading: authLoading } = useAuth();

  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const safeEventId = eventId || '';
  const safeOtherId = otherProfileId || '';

  const { data: otherProfile, isLoading: otherLoading } = useQuery({
    queryKey: ['chat-other-profile', safeOtherId],
    queryFn: async () => {
      if (!safeOtherId) return null;
      const { data, error } = await supabase.from('profiles').select('*').eq('id', safeOtherId).maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!safeOtherId,
  });

  const { data: connection, isLoading: connectionLoading } = useQuery({
    queryKey: ['chat-connection', safeEventId, profile?.id, safeOtherId],
    queryFn: async () => {
      if (!profile?.id || !safeEventId || !safeOtherId) return null;
      const orFilter = `and(profile_a_id.eq.${profile.id},profile_b_id.eq.${safeOtherId}),and(profile_a_id.eq.${safeOtherId},profile_b_id.eq.${profile.id})`;
      const { data, error } = await supabase
        .from('connections')
        .select('*')
        .eq('event_id', safeEventId)
        .eq('is_mutual', true)
        .or(orFilter)
        .maybeSingle();
      if (error) throw error;
      return data as any;
    },
    enabled: !!profile?.id && !!safeEventId && !!safeOtherId,
  });

  const connectionId = useMemo(() => connection?.id as string | undefined, [connection]);

  const { data: messages = [], isLoading: messagesLoading, refetch } = useQuery({
    queryKey: ['chat-messages', connectionId],
    queryFn: async () => {
      if (!connectionId) return [];
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('connection_id', connectionId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data as Message[]) || [];
    },
    enabled: !!connectionId,
  });

  useEffect(() => {
    if (!connectionId) return;
    const channel = supabase
      .channel(`messages:${connectionId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages', filter: `connection_id=eq.${connectionId}` },
        () => refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [connectionId, refetch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (!authLoading && !user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(`/evento/${eventId}/social`)}`} replace />;
  }

  if (!authLoading && user && !profile) {
    return <Navigate to={`/completar-perfil?redirect=${encodeURIComponent(`/evento/${eventId}/social`)}`} replace />;
  }

  if (!eventId || !otherProfileId) {
    return <Navigate to="/" replace />;
  }

  const handleSend = async () => {
    if (!profile?.id || !connectionId) return;
    const content = text.trim();
    if (!content) return;

    // Basic client-side limit
    if (content.length > 1000) return;

    setSending(true);
    try {
      const { error } = await supabase.from('messages').insert({
        connection_id: connectionId,
        sender_profile_id: profile.id,
        content,
      });
      if (!error) setText('');
    } finally {
      setSending(false);
    }
  };

  const loading = authLoading || otherLoading || connectionLoading || messagesLoading;

  return (
    <Layout>
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/evento/${eventId}/social`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold truncate">
              {otherProfile?.nickname || 'Chat'}
            </h1>
            <p className="text-sm text-muted-foreground">Conversa do evento</p>
          </div>
        </div>

        <Card className="border-border/50">
          <div className="p-4 md:p-6">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-5 w-1/3" />
              </div>
            ) : !connectionId ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Chat indisponível: conexão não encontrada.</p>
              </div>
            ) : (
              <div className="h-[55vh] overflow-y-auto pr-2 space-y-3">
                {messages.map((m) => {
                  const mine = m.sender_profile_id === profile?.id;
                  return (
                    <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={
                          mine
                            ? 'max-w-[80%] rounded-2xl px-4 py-2 bg-primary text-primary-foreground'
                            : 'max-w-[80%] rounded-2xl px-4 py-2 bg-secondary text-foreground'
                        }
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          <div className="border-t border-border p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Digite sua mensagem..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                onClick={handleSend}
                disabled={sending || !connectionId}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Seja respeitoso. Mensagens são visíveis apenas para o match.
            </p>
          </div>
        </Card>
      </main>
    </Layout>
  );
}
