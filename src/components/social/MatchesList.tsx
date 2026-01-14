import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, MessageCircle, Heart } from 'lucide-react';
import type { Profile } from '@/types/database';

interface MatchesListProps {
  matches: Profile[];
  eventId: string;
}

export function MatchesList({ matches, eventId }: MatchesListProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum match ainda</h3>
        <p className="text-muted-foreground">
          Continue explorando para encontrar conexões!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {matches.map((profile) => (
        <Link key={profile.id} to={`/evento/${eventId}/chat/${profile.id}`}>
          <Card className="group overflow-hidden bg-card border-border/50 hover:border-primary/50 transition-all hover-lift">
            <div className="aspect-square relative overflow-hidden">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.nickname}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                  <User className="h-12 w-12 text-primary-foreground/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              
              {/* Online indicator placeholder */}
              <div className="absolute top-2 right-2">
                <div className="h-3 w-3 rounded-full bg-success border-2 border-background" />
              </div>

              {/* Message icon on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/50">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </div>
            
            <div className="p-3">
              <h3 className="font-semibold truncate">{profile.nickname}</h3>
              <p className="text-sm text-muted-foreground">{profile.age} anos</p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
