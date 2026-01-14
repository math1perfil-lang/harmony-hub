import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, User, Users, Heart, X } from 'lucide-react';
import type { Profile } from '@/types/database';

interface ProfileCardProps {
  profile: Profile;
  onLike: () => void;
  onPass: () => void;
  isTop?: boolean;
}

const identityLabels: Record<string, string> = {
  man: 'Homem',
  woman: 'Mulher',
  non_binary: 'Não-binário',
  other: 'Outro',
};

const profileTypeLabels: Record<string, string> = {
  individual: 'Individual',
  couple: 'Casal',
};

export function ProfileCard({ profile, onLike, onPass, isTop = false }: ProfileCardProps) {
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      setExitDirection('right');
      onLike();
    } else if (info.offset.x < -threshold) {
      setExitDirection('left');
      onPass();
    }
  };

  const handleLikeClick = () => {
    setExitDirection('right');
    onLike();
  };

  const handlePassClick = () => {
    setExitDirection('left');
    onPass();
  };

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, rotate, zIndex: isTop ? 10 : 0 }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.5 }}
      animate={{ 
        scale: isTop ? 1 : 0.95, 
        opacity: isTop ? 1 : 0.7,
        x: exitDirection === 'left' ? -500 : exitDirection === 'right' ? 500 : 0,
      }}
      exit={{ 
        x: exitDirection === 'left' ? -500 : 500,
        opacity: 0,
        transition: { duration: 0.3 }
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Card className="h-full w-full overflow-hidden bg-card border-border/50 shadow-2xl">
        {/* Profile Image */}
        <div className="relative h-[60%] overflow-hidden">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.nickname}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
              <User className="h-24 w-24 text-primary-foreground/50" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          {/* Like/Pass Indicators */}
          {isTop && (
            <>
              <motion.div 
                className="absolute top-8 right-8 rotate-12"
                style={{ opacity: likeOpacity }}
              >
                <div className="px-4 py-2 border-4 border-success rounded-lg">
                  <span className="text-2xl font-bold text-success">LIKE</span>
                </div>
              </motion.div>
              <motion.div 
                className="absolute top-8 left-8 -rotate-12"
                style={{ opacity: passOpacity }}
              >
                <div className="px-4 py-2 border-4 border-destructive rounded-lg">
                  <span className="text-2xl font-bold text-destructive">NOPE</span>
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Profile Info */}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">
                {profile.nickname}, {profile.age}
              </h2>
              <div className="flex items-center gap-1 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <span>{profile.city}</span>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className="flex items-center gap-1"
            >
              {profile.profile_type === 'couple' ? (
                <Users className="h-3 w-3" />
              ) : (
                <User className="h-3 w-3" />
              )}
              {profileTypeLabels[profile.profile_type]}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {profile.identity === 'other' && profile.identity_other 
                ? profile.identity_other 
                : identityLabels[profile.identity]}
            </Badge>
          </div>

          {profile.bio && (
            <p className="text-muted-foreground line-clamp-3">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {isTop && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6">
            <button
              onClick={handlePassClick}
              className="h-16 w-16 rounded-full bg-card border-2 border-destructive flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <X className="h-8 w-8 text-destructive" />
            </button>
            <button
              onClick={handleLikeClick}
              className="h-16 w-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <Heart className="h-8 w-8 text-white fill-white" />
            </button>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
