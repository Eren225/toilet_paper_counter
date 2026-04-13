import type { DashboardState } from '../../types/dashboard';
import Icon from './Icon';
import RoommateCard from './RoommateCard';

type DashboardLayoutProps = {
  state: DashboardState;
  onLogout: () => void;
  onAddRoll: (roommateId: string) => void;
  onNewPack: () => void;
};

export default function DashboardLayout({
  state,
  onLogout,
  onAddRoll,
  onNewPack,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <header className="sticky top-0 z-40 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 backdrop-blur md:px-10">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-on-primary shadow-[0_16px_40px_rgba(0,96,173,0.25)]">
            PQ
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-secondary">4eme 204</p>
            <h1 className="font-display text-2xl font-black tracking-tight text-on-surface">
              PQ Counter
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-6 md:flex">
            <span className="font-bold text-primary">Dashboard</span>
            <span className="text-on-surface-variant">Historique</span>
          </div>
          <button
            className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container-low"
            type="button"
          >
            <Icon name="history" />
          </button>
          <button
            className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-on-primary shadow-[0_12px_30px_rgba(0,96,173,0.28)] transition hover:scale-[0.98]"
            onClick={onNewPack}
            type="button"
          >
            Nouveau pack
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-28 pt-6 md:px-10">
        <section className="rounded-[2rem] bg-surface-container-low p-5 shadow-[0_16px_40px_rgba(25,40,72,0.05)] md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-on-surface-variant">
                Connexion
              </p>
              <h2 className="mt-1 text-xl font-bold text-on-surface">Ton profil personnel</h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                {state.auth.currentUserId
                  ? `Connecté en tant que ${state.roommates.find(({ id }) => id === state.auth.currentUserId)?.name || ''}`
                  : 'Veuillez vous connecter pour signaler une consommation.'}
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 md:w-auto">
              <div className="sm:col-span-2" />
              <button
                className="flex-1 rounded-full bg-surface-container-high px-4 py-3 text-sm font-bold text-on-surface hover:bg-surface-container-highest transition"
                onClick={onLogout}
                type="button"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <article className="relative overflow-hidden rounded-[2rem] bg-surface-container-low p-8 shadow-[0_16px_40px_rgba(25,40,72,0.05)] md:col-span-8">
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-secondary">
                Stock actuel
              </span>
              <h2 className="mt-4 text-6xl font-black tracking-[-0.06em] text-on-surface md:text-8xl">
                {state.rollsLeft}{' '}
                <span className="text-2xl font-medium tracking-normal text-on-surface-variant md:text-3xl">
                  rouleaux restants
                </span>
              </h2>

              <div className="mt-8 flex items-center gap-4">
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-primary),var(--color-primary-container))]"
                    style={{ width: `${state.percentLeft}%` }}
                  />
                </div>
                <span className="font-bold text-primary">{state.percentLeft}%</span>
              </div>

              <p className="mt-5 text-sm text-on-surface-variant">
                Pack de {state.totalRolls} rouleaux. Dernier achat déclaré par {state.lastBuyer}.
              </p>
            </div>

            <div className="absolute -right-14 -top-14 h-56 w-56 rounded-full bg-primary/8 blur-3xl" />
          </article>

          <article className="flex flex-col items-center justify-center rounded-[2rem] bg-primary p-8 text-center text-on-primary shadow-[0_20px_50px_rgba(0,96,173,0.25)] md:col-span-4">
            <span className="mb-2 text-sm font-medium text-white/70">Total consommé</span>
            <div className="text-6xl font-black">{state.usedTotal}</div>
            <button
              className="mt-6 rounded-full bg-white/20 px-6 py-3 text-sm font-bold backdrop-blur transition hover:bg-white/30"
              type="button"
            >
              Historique complet
            </button>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="rounded-[1.75rem] border border-primary/10 bg-surface-container-lowest p-6 shadow-[0_16px_40px_rgba(25,40,72,0.05)]">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-on-surface-variant">
              Achat actuel
            </p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <h3 className="text-3xl font-black text-on-surface">{state.lastBuyer}</h3>
                <p className="mt-2 max-w-md text-sm text-on-surface-variant">
                  C&apos;est la personne qui a acheté le pack en cours. Cette info reste visible pour éviter les débats en fin de cycle.
                </p>
              </div>
              <div className="rounded-2xl bg-primary/8 px-4 py-3 text-sm font-bold text-primary">
                Pack en cours
              </div>
            </div>
          </article>

          <article className="rounded-[1.75rem] bg-secondary p-6 text-on-secondary shadow-[0_18px_45px_rgba(19,109,65,0.22)]">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/70">
              Prochain tour
            </p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <h3 className="text-3xl font-black text-white">{state.nextBuyer}</h3>
                <p className="mt-2 max-w-md text-sm text-white/75">
                  La rotation suit l&apos;ordre fixe des colocataires. Au prochain paquet vide, ce sera à {state.nextBuyer} de payer.
                </p>
              </div>
              <div className="rounded-2xl bg-white/15 px-4 py-3 text-sm font-bold text-white">
                Tour suivant
              </div>
            </div>
          </article>
        </section>

        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-on-surface">Colocataires</h2>
              <p className="mt-1 text-on-surface-variant">
                Activité sur le paquet actuel.
              </p>
            </div>
            <span className="hidden rounded-full bg-secondary-fixed px-4 py-2 text-sm font-semibold text-on-secondary-fixed md:inline-flex">
              {state.activeUsers} utilisateurs actifs
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {state.roommates.map((roommate) => (
              <RoommateCard
                isActiveUser={roommate.id === state.auth.currentUserId}
                key={roommate.id}
                roommate={roommate}
                onAddRoll={onAddRoll}
              />
            ))}
          </div>
        </section>

        <footer className="pb-8 text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-surface-container px-5 py-4 text-sm font-medium text-on-surface-variant">
            <span className="text-secondary">
              <Icon name="shield" />
            </span>
            Sécurisé avec Supabase et TanStack Query.
          </div>
        </footer>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-outline-variant/10 bg-surface-container-lowest px-6 py-3 md:hidden">
        {[
          { icon: 'dashboard' as const, label: 'Accueil', active: true },
          { icon: 'group' as const, label: 'Coloc', active: false },
          { icon: 'box' as const, label: 'Stock', active: false },
          { icon: 'settings' as const, label: 'Menu', active: false },
        ].map((item) => (
          <button
            className={`flex flex-col items-center gap-1 ${item.active ? 'text-primary' : 'text-on-surface-variant'}`}
            key={item.label}
            type="button"
          >
            <Icon name={item.icon} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}