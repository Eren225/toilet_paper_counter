import { useState } from 'react';
import type { Roommate } from '../../types/dashboard';
import Icon from './Icon';
import { motion, AnimatePresence } from 'framer-motion';
import wishIVideo from '../../assets/wishI.mp4';

type RoommateCardProps = {
  roommate: Roommate;
  isActiveUser: boolean;
  isStockEmpty?: boolean;
  onAddRoll: (roommateId: string) => void;
};

export default function RoommateCard({ roommate, isActiveUser, isStockEmpty, onAddRoll }: RoommateCardProps) {
  const [clickCount, setClickCount] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const handleAvatarClick = () => {
    // Rend insensible à la casse au cas où
    if (roommate.name.toLowerCase() === 'mathisglaude1') {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      if (newCount >= 5) {
        setShowVideo(true);
        setClickCount(0); // On reset après
      }
    }
  };

  return (
    <motion.article 
      whileHover={{ y: -4 }}
      className="group rounded-[1.75rem] bg-surface-container-lowest p-6 shadow-[0_18px_40px_rgba(20,33,61,0.06)]"
    >
      <div className="mb-6 flex items-center gap-4">
        <img
          alt={roommate.name}
          onClick={handleAvatarClick}
          className={`${roommate.name.toLowerCase() === 'mathisglaude1' ? 'cursor-pointer transition hover:scale-110 active:scale-95' : ''} h-14 w-14 rounded-full object-cover ring-4 ring-surface-container`}
          src={roommate.avatar}
        />
        <div>
          <h3 className="text-lg font-bold text-on-surface">{roommate.name}</h3>
          <p className="text-xs text-on-surface-variant">Dernière activité : {roommate.lastActive}</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl bg-surface-container-low p-4">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          Rouleaux ouverts
        </p>
        <motion.div 
          key={roommate.opened}
          initial={{ scale: 1.5, color: 'var(--color-primary)' }}
          animate={{ scale: 1, color: 'var(--color-on-surface)' }}
          className="text-3xl font-black text-primary"
        >
          {roommate.opened}
        </motion.div>
      </div>

      <motion.button
        whileTap={isActiveUser && !isStockEmpty ? { scale: 0.95 } : {}}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-surface-container-high px-5 py-4 text-sm font-bold text-on-surface transition group-hover:bg-[linear-gradient(135deg,var(--color-primary),var(--color-primary-container))] group-hover:text-on-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:group-hover:bg-surface-container-high disabled:group-hover:text-on-surface"
        disabled={!isActiveUser || isStockEmpty}
        onClick={() => onAddRoll(roommate.id)}
        type="button"
      >
        {isStockEmpty ? (
          <>
            <Icon name="box" />
            Stock vide
          </>
        ) : (
          <>
            <Icon name="plus" />
            J&apos;ai ouvert un rouleau
          </>
        )}
      </motion.button>

      {/* EASTER EGG VIDEO */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setShowVideo(false)} // Permet de fermer en cliquant n'importe où
          >
            <video 
              src={wishIVideo} 
              autoPlay 
              playsInline
              onEnded={() => setShowVideo(false)}
              className="max-h-[70vh] max-w-lg rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              onClick={(e) => e.stopPropagation()} // Évite de fermer en cliquant sur la vidéo
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}