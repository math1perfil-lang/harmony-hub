import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Profile } from '@/types/database';

interface UseSocialProfilesProps {
  eventId: string;
  currentProfileId: string | undefined;
  interactionPreference: string | undefined;
}

export function useSocialProfiles({ eventId, currentProfileId, interactionPreference }: UseSocialProfilesProps) {
  const queryClient = useQueryClient();

  // Fetch profiles that are confirmed for this event, excluding current user and already liked
  const { data: profiles, isLoading, refetch } = useQuery({
    queryKey: ['social-profiles', eventId, currentProfileId],
    queryFn: async () => {
      if (!currentProfileId) return [];

      // Get profiles that user already liked
      const { data: likedProfiles } = await supabase
        .from('likes')
        .select('to_profile_id')
        .eq('event_id', eventId)
        .eq('from_profile_id', currentProfileId);

      const likedIds = likedProfiles?.map(l => l.to_profile_id) || [];

      // Get confirmed participants for this event
      const { data: participations } = await supabase
        .from('event_participations')
        .select('profile_id')
        .eq('event_id', eventId)
        .eq('status', 'confirmed');

      const participantIds = participations?.map(p => p.profile_id) || [];

      if (participantIds.length === 0) return [];

      // Get profiles
      let query = supabase
        .from('profiles')
        .select('*')
        .in('id', participantIds)
        .neq('id', currentProfileId)
        .eq('is_active', true);

      // Filter based on interaction preference
      if (interactionPreference === 'individuals') {
        query = query.eq('profile_type', 'individual');
      } else if (interactionPreference === 'couples') {
        query = query.eq('profile_type', 'couple');
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filter out already liked profiles
      const filteredProfiles = (data as Profile[]).filter(
        p => !likedIds.includes(p.id)
      );

      return filteredProfiles;
    },
    enabled: !!currentProfileId && !!eventId,
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async (toProfileId: string) => {
      if (!currentProfileId) throw new Error('Not authenticated');

      // Create the like
      const { error: likeError } = await supabase
        .from('likes')
        .insert({
          event_id: eventId,
          from_profile_id: currentProfileId,
          to_profile_id: toProfileId,
        });

      if (likeError) throw likeError;

      // Check if the other person already liked us (match!)
      const { data: reciprocalLike } = await supabase
        .from('likes')
        .select('id')
        .eq('event_id', eventId)
        .eq('from_profile_id', toProfileId)
        .eq('to_profile_id', currentProfileId)
        .maybeSingle();

      if (reciprocalLike) {
        // Create a connection (match)
        const { error: connectionError } = await supabase
          .from('connections')
          .insert({
            event_id: eventId,
            profile_a_id: currentProfileId,
            profile_b_id: toProfileId,
            is_mutual: true,
          });

        if (connectionError) throw connectionError;

        return { matched: true, profileId: toProfileId };
      }

      return { matched: false, profileId: toProfileId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-profiles', eventId] });
      queryClient.invalidateQueries({ queryKey: ['matches', eventId] });
    },
  });

  return {
    profiles: profiles || [],
    isLoading,
    refetch,
    like: likeMutation.mutateAsync,
    isLiking: likeMutation.isPending,
  };
}

export function useMatches(eventId: string, currentProfileId: string | undefined) {
  return useQuery({
    queryKey: ['matches', eventId, currentProfileId],
    queryFn: async () => {
      if (!currentProfileId) return [];

      const { data: connections, error } = await supabase
        .from('connections')
        .select('*')
        .eq('event_id', eventId)
        .eq('is_mutual', true)
        .or(`profile_a_id.eq.${currentProfileId},profile_b_id.eq.${currentProfileId}`);

      if (error) throw error;

      // Get the other profile IDs
      const otherProfileIds = connections.map(c => 
        c.profile_a_id === currentProfileId ? c.profile_b_id : c.profile_a_id
      );

      if (otherProfileIds.length === 0) return [];

      // Fetch the matched profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', otherProfileIds);

      return (profiles as Profile[]) || [];
    },
    enabled: !!currentProfileId && !!eventId,
  });
}
