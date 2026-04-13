import type { Roommate } from '../../types/dashboard';
import Icon from './Icon';

type RoommateCardProps = {
  roommate: Roommate;
  isActiveUser: boolean;
  onAddRoll: (roommateId: string) => void;
};

export default function RoommateCard({ roommate, isActiveUser, onAddRoll }: RoommateCardProps) {
  return (
    <article className="group rounded-[1.75rem] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_18px_40px_rgba(20,33,61,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(20,33,61,0.1)]">
      <div className="mb-6 flex items-center gap-4">
        <img
          alt={roommate.name}
          className="h-14 w-14 rounded-full object-cover ring-4 ring-surface-container"
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
        <div className="text-3xl font-black text-primary">{roommate.opened}</div>
      </div>

      <button
        className="flex w-full items-center justify-center gap-2 rounded-full bg-surface-container-high px-5 py-4 text-sm font-bold text-on-surface transition group-hover:bg-primary group-hover:text-on-primary disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!isActiveUser}
        onClick={() => onAddRoll(roommate.id)}
        type="button"
      >
        <Icon name="plus" />
        J&apos;ai ouvert un rouleau
      </button>
    </article>
  );
}