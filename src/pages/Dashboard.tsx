import DashboardLayout from '../components/dashboard/DashboardLayout';
import type { DashboardState, Roommate } from '../types/dashboard';
import { useAuthUser, useProfiles, useSignOut } from '../hooks/queries/useAuth';
import { useCurrentPack, useUsagesForPack, useCreatePack, useIncrementRoll } from '../hooks/queries/usePacks';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import relativeTime from 'dayjs/plugin/relativeTime';
import Login from './Login';

dayjs.extend(relativeTime);
dayjs.locale('fr');

export default function Dashboard() {
  const { data: userProfile, isLoading: isUserLoading } = useAuthUser();
  const { data: profiles } = useProfiles();
  const { data: pack, isLoading: isPackLoading } = useCurrentPack();
  const { data: usages = [] } = useUsagesForPack(pack?.id);
  
  const signOutMutation = useSignOut();
  const createPackMutation = useCreatePack();
  const incrementRollMutation = useIncrementRoll();

  if (isUserLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface px-6 text-center text-on-surface">
        <div>
          <div className="grid mx-auto h-16 w-16 place-items-center rounded-3xl bg-primary text-2xl text-on-primary shadow-[0_16px_40px_rgba(0,96,173,0.25)] animate-pulse mb-6">
            PQ
          </div>
          <h1 className="text-2xl font-black">Chargement de votre session...</h1>
        </div>
      </div>
    );
  }

  // If not logged in, show login page directly.
  if (!userProfile) {
    return <Login />;
  }

  const handleLogout = () => {
    signOutMutation.mutate();
  };

  const handleAddRoll = (roommateId: string) => {
    if (!pack) {
      alert("Il n'y a pas de paquet en cours ! Veuillez créer un nouveau pack d'abord.");
      return;
    }
    incrementRollMutation.mutate({ userId: roommateId, packId: pack.id });
  };

  const handleNewPack = () => {
    if (!userProfile) return;
    const rollsCount = window.prompt("Combien de rouleaux dans ce nouveau paquet ?", "16");
    if (rollsCount) {
        createPackMutation.mutate({ buyerId: userProfile.id, totalRolls: parseInt(rollsCount, 10) });
    }
  };

  const activeUsers = profiles?.length || 4;
  const totalRolls = pack?.total_rolls || 16;
  const usedTotal = usages.length;
  const rollsLeft = Math.max(0, totalRolls - usedTotal);
  const percentLeft = totalRolls > 0 ? Math.round((rollsLeft / totalRolls) * 100) : 0;
  
  // Buyer tracking
  const lastBuyer = pack?.buyer?.name || 'Inconnu';
  // Rotation alphabétique des colocataires
  let nextBuyer = 'Inconnu';
  if (profiles && profiles.length > 0) {
    const sortedProfiles = [...profiles].sort((a, b) => a.name.localeCompare(b.name));
    if (!pack?.buyer_id) {
       nextBuyer = sortedProfiles[0].name;
    } else {
       const currentIndex = sortedProfiles.findIndex(p => p.id === pack.buyer_id);
       const nextIndex = currentIndex !== -1 ? (currentIndex + 1) % sortedProfiles.length : 0;
       nextBuyer = sortedProfiles[nextIndex].name;
    }
  }

  const roommates: Roommate[] = (profiles || []).map(p => {
    const userUsages = usages.filter(u => u.user_id === p.id);
    const lastUsage = userUsages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    
    return {
      id: p.id as any,
      name: p.name,
      opened: userUsages.length,
      lastActive: lastUsage ? dayjs(lastUsage.created_at).fromNow() : 'Jamais',
      avatar: p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=random`
    };
  });

  const state: DashboardState = {
    totalRolls,
    rollsLeft,
    usedTotal,
    percentLeft,
    activeUsers,
    lastBuyer,
    nextBuyer,
    auth: {
      currentUserId: userProfile.id,
      availableUsers: []
    },
    roommates
  };

  if (isPackLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface px-6 text-center text-on-surface">
        <div>
          <h1 className="mt-3 text-3xl font-black">Chargement des données...</h1>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      state={state}
      onLogout={handleLogout}
      onAddRoll={handleAddRoll}
      onNewPack={handleNewPack}
    />
  );
}
