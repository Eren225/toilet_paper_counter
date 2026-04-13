import type { Roommate } from '../../types/dashboard';
import Icon from './Icon';
import { motion } from 'framer-motion';

type RoommateCardProps = {
  roommate: Roommate;
  isActiveUser: boolean;
  isStockEmpty?: boolean;
  onAddRoll: (roommateId: string) => void;
  onAvatarClick?: () => void;
};

export default function RoommateCard({ roommate, isActiveUser, isStockEmpty, onAddRoll, onAvatarClick }: RoommateCardProps) {
  return (
    <motion.article 
      whileHover={{ y: -4 }}
      className="group border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mb-6 flex items-center gap-4">
        <img
          alt={roommate.name}
          onClick={onAvatarClick}
          className={`${roommate.name.toLowerCase().includes('mathis_bite') ? 'cursor-pointer transition hover:scale-110 active:scale-95' : ''} h-14 w-14 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-800`}
          src={roommate.avatar}
        />
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">{roommate.name}</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">Dernière activité : {roommate.lastActive}</p>
        </div>
      </div>

      <div className="mb-6 bg-slate-100 p-4 dark:bg-slate-800">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
          Rouleaux ouverts
        </p>
        <motion.div 
          key={roommate.opened}
          className="text-3xl font-black text-slate-900 dark:text-slate-50"
        >
          {roommate.opened}
        </motion.div>
      </div>

      <motion.button
        whileTap={isActiveUser && !isStockEmpty ? { scale: 0.95 } : {}}
        className="flex w-full items-center justify-center gap-2 bg-slate-900 px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
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
    </motion.article>
  );
}