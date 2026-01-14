import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, X } from 'lucide-react';
import type { Profile } from '@/types/database';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedProfile: Profile | null;
  currentProfile: Profile | null;
}

export function MatchModal({ isOpen, onClose, matchedProfile, currentProfile }: MatchModalProps) {
  if (!matchedProfile || !currentProfile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-pink-500/20 via-background to-purple-500/20 border-primary/50">
        <div className="flex flex-col items-center text-center py-6">
          {/* Match Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mb-6"
          >
            <div className="relative">
              <Heart className="h-20 w-20 text-pink-500 fill-pink-500" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Heart className="h-20 w-20 text-pink-500 fill-pink-500 opacity-50" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-3xl font-bold text-gradient mb-2"
          >
            É um Match!
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mb-8"
          >
            Você e {matchedProfile.nickname} curtiram um ao outro!
          </motion.p>

          {/* Profile Avatars */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="relative">
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-primary/50">
                {currentProfile.avatar_url ? (
                  <img 
                    src={currentProfile.avatar_url} 
                    alt={currentProfile.nickname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl font-bold">{currentProfile.nickname[0]}</span>
                  </div>
                )}
              </div>
            </div>

            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1, repeatDelay: 0.5 }}
            >
              <Heart className="h-8 w-8 text-pink-500 fill-pink-500" />
            </motion.div>

            <div className="relative">
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-primary/50">
                {matchedProfile.avatar_url ? (
                  <img 
                    src={matchedProfile.avatar_url} 
                    alt={matchedProfile.nickname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl font-bold">{matchedProfile.nickname[0]}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-3 w-full"
          >
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              Continuar Explorando
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90"
              onClick={onClose}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Enviar Mensagem
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
