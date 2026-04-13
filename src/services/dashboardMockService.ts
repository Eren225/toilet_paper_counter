import type { DashboardState, RoommateId } from '../types/dashboard';

const buyerRotation = ['elie', 'erwan', 'matteo', 'mathis'] as const;

const roommates = [
  {
    id: 'elie',
    name: 'Elie',
    opened: 2,
    lastActive: 'Il y a 2h',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'erwan',
    name: 'Erwan',
    opened: 3,
    lastActive: 'Il y a 5h',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'matteo',
    name: 'Mattéo',
    opened: 1,
    lastActive: 'Hier',
    avatar:
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'mathis',
    name: 'Mathis',
    opened: 2,
    lastActive: 'Il y a 1h',
    avatar:
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=240&q=80',
  },
] satisfies DashboardState['roommates'];

const availableUsers = roommates.map(({ id, name }) => ({
  id,
  label: name,
}));

function buildState(currentUserId: RoommateId | '' = ''): DashboardState {
  const totalRolls = 16;
  const usedTotal = roommates.reduce((total, roommate) => total + roommate.opened, 0);
  const rollsLeft = totalRolls - usedTotal;
  const percentLeft = Math.round((rollsLeft / totalRolls) * 100);
  const lastBuyerId = 'mathis';
  const lastBuyerIndex = buyerRotation.indexOf(lastBuyerId);
  const nextBuyerId = buyerRotation[(lastBuyerIndex + 1) % buyerRotation.length];
  const lastBuyer = roommates.find(({ id }) => id === lastBuyerId)?.name ?? 'Mathis';
  const nextBuyer = roommates.find(({ id }) => id === nextBuyerId)?.name ?? 'Elie';

  return {
    totalRolls,
    rollsLeft,
    usedTotal,
    percentLeft,
    estimatedDepletion: 'dans 2 jours',
    activeUsers: roommates.length,
    lastBuyer,
    nextBuyer,
    auth: {
      currentUserId,
      availableUsers,
    },
    roommates,
  };
}

export const dashboardMockService = {
  async getState(currentUserId: RoommateId | '' = ''): Promise<DashboardState> {
    return Promise.resolve(buildState(currentUserId));
  },
};