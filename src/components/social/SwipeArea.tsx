import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ProfileCard } from './ProfileCard';
import { MatchModal } from './MatchModal';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Profile } from '@/types/database';

interface SwipeAreaProps {
  profiles: Profile[];
  currentProfile: Profile;
  onLike: (profileId: string) => Promise<{ matched: boolean; profileId: string }>;
  onRefresh: () => void;
  isLoading: boolean;
}

export function SwipeArea({ profiles, currentProfile, onLike, onRefresh, isLoading }: SwipeAreaProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  const handleLike = useCallback(async () => {
    const profile = profiles[currentIndex];
    if (!profile) return;

    try {
      const result = await onLike(profile.id);
      if (result.matched) {
        setMatchedProfile(profile);
        setShowMatchModal(true);
      }
    } catch (error) {
      console.error('Error liking profile:', error);
    }

    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, profiles, onLike]);

  const handlePass = useCallback(() => {
    setCurrentIndex(prev => prev + 1);
  }, []);

  const visibleProfiles = profiles.slice(currentIndex, currentIndex + 2);

  if (isLoading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-primary/20 animate-pulse mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary animate-spin" />
          </div>
          <p className="text-muted-foreground">Carregando perfis...</p>
        </div>
      </div>
    );
  }

  if (visibleProfiles.length === 0) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 rounded-full bg-primary/10 mx-auto mb-6 flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-2xl font-display font-bold mb-3">
            Você viu todos os perfis!
          </h3>
          <p className="text-muted-foreground mb-6">
            Volte mais tarde para descobrir novas conexões ou confira seus matches.
          </p>
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative h-[70vh] max-w-sm mx-auto">
        <AnimatePresence>
          {visibleProfiles.map((profile, index) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onLike={handleLike}
              onPass={handlePass}
              isTop={index === 0}
            />
          ))}
        </AnimatePresence>
      </div>

      <MatchModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        matchedProfile={matchedProfile}
        currentProfile={currentProfile}
      />
    </>
  );
}
