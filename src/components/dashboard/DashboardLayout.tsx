import { useState } from 'react';
import type { DashboardState } from '../../types/dashboard';
import Icon from './Icon';
import HistoryModal from './HistoryModal';
import AnalysisModal from './AnalysisModal';
import RoommateCard from './RoommateCard';
import { motion, AnimatePresence } from 'framer-motion';
import wishIVideo from '../../assets/wishI.mp4';
import iamVideo from '../../assets/iam.mp4';

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
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [mathisCount, setMathisCount] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [erwanCount, setErwanCount] = useState(0);
  const [showIamVideo, setShowIamVideo] = useState(false);

  const handleAvatarClick = (username: string) => {
    if (username === 'Mathis_bite') {
      const newCount = mathisCount + 1;
      setMathisCount(newCount);
      if (newCount === 5) {
        setShowVideo(true);
        setMathisCount(0);
      }
    } else if (username === 'Erwan 67') {
      const newCount = erwanCount + 1;
      setErwanCount(newCount);
      if (newCount === 5) {
        setShowIamVideo(true);
        setErwanCount(0);
      }
    }
  };

  const currentUser = state.roommates.find(({ id }) => id === state.auth.currentUserId);
  const canValidateRoll = Boolean(state.auth.currentUserId);

  const stockLabel = state.rollsLeft === 0
    ? 'Stock vide'
    : state.percentLeft <= 25 || state.rollsLeft <= 3
      ? 'Stock faible'
      : 'Stock normal';

  const stockTone = state.rollsLeft === 0
    ? 'text-red-600 dark:text-red-400'
    : state.percentLeft <= 25 || state.rollsLeft <= 3
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-slate-900 dark:text-slate-50';

  const progressWidth = `${Math.max(2, state.percentLeft)}%`;
  const openedCurrentPack = Math.max(0, Math.min(state.totalRolls, state.totalRolls - state.rollsLeft));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
      <AnalysisModal isOpen={isAnalysisOpen} onClose={() => setIsAnalysisOpen(false)} />

      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-slate-50 px-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center gap-8">
          <span className="text-xl font-black tracking-tighter">Kikachié</span>
          <div className="hidden items-center gap-6 md:flex">
            <span className="border-b-2 border-slate-900 py-1 text-[10px] font-bold uppercase tracking-tight dark:border-slate-50">Inventaire</span>
            <button className="py-1 text-[10px] font-bold uppercase tracking-tight text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50" onClick={() => setIsHistoryOpen(true)} type="button">Historique</button>
            <button className="py-1 text-[10px] font-bold uppercase tracking-tight text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50" onClick={() => setIsAnalysisOpen(true)} type="button">Analyses</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="p-2 transition hover:opacity-70"
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            title="Historique"
          >
            <Icon name="history" />
          </button>
          <button
            className="bg-slate-900 px-4 py-2 text-[10px] font-bold uppercase tracking-tight text-white transition-colors hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-100"
            onClick={onNewPack}
            type="button"
          >
            Nouveau pack
          </button>
          <button
            className="p-2 transition hover:opacity-70"
            onClick={onLogout}
            title="Logout"
            type="button"
          >
            <Icon name="settings" />
          </button>
        </div>
      </header>

      <main className="min-h-screen bg-slate-50 pt-16 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl space-y-12 p-8">
          <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-8 dark:border-slate-800 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">Tableau de bord</span>
              <h1 className="mt-2 text-5xl font-black tracking-tighter text-slate-300 dark:text-slate-600">PRECISION TRACKING SYSTEM</h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Connecté: {currentUser?.name || 'Aucun utilisateur'}</p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <button
                className="flex items-center justify-center gap-2 bg-slate-900 px-6 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-50 dark:text-slate-900"
                disabled={!canValidateRoll || state.rollsLeft === 0}
                onClick={() => {
                  if (state.auth.currentUserId) {
                    onAddRoll(state.auth.currentUserId);
                  }
                }}
                type="button"
              >
                <Icon name="plus" className="h-5 w-5" />
                j&apos;ai ouvert un rouleau
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <section className="relative col-span-1 flex min-h-[400px] flex-col justify-between overflow-hidden border border-slate-200 bg-slate-100 p-8 dark:border-slate-800 dark:bg-slate-900 md:col-span-8">
              <div className="relative z-10 flex flex-col gap-2">
                <span className="text-[clamp(2rem,10vw,72px)] font-black leading-none tracking-widest text-slate-300 dark:text-slate-600">ROULEAUX</span>
                <div className="h-1 w-full bg-slate-300 dark:bg-slate-700">
                  <div className="h-full bg-slate-900 dark:bg-slate-50" style={{ width: progressWidth }} />
                </div>
                <span className={`text-[clamp(5rem,25vw,180px)] font-black leading-none tracking-tighter ${stockTone}`}>{state.rollsLeft}</span>
              </div>
              <div className="relative z-10 flex flex-wrap items-center gap-8 border-t border-slate-300 pt-8 dark:border-slate-700">
                <div>
                  <span className="mb-1 block text-[10px] font-bold uppercase text-slate-600 dark:text-slate-300">État</span>
                  <span className={`text-sm font-bold uppercase ${stockTone}`}>{stockLabel}</span>
                </div>
                <div>
                  <span className="mb-1 block text-[10px] font-bold uppercase text-slate-600 dark:text-slate-300">Rupture estimée</span>
                  <span className="text-sm font-bold uppercase">{state.estimatedDepletion}</span>
                </div>
                <div className="ml-auto">
                  <button className="bg-slate-900 px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-80 dark:bg-slate-50 dark:text-slate-900" onClick={onNewPack} type="button">Nouveau pack</button>
                </div>
              </div>
            </section>

            <section className="col-span-1 flex flex-col border-l-4 border-slate-900 bg-slate-200 p-8 dark:border-slate-50 dark:bg-slate-800 md:col-span-4">
              <span className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-700 dark:text-slate-200">
                <span className="h-2 w-2 bg-slate-900 dark:bg-slate-50" />
                Statistiques de consommation
              </span>
              <div className="flex-1 space-y-10">
                <div>
                  <span className="block text-[40px] font-black leading-none tracking-tighter">{state.percentLeft}%</span>
                  <span className="mt-2 block text-[10px] font-bold uppercase text-slate-600 dark:text-slate-300">Capacité restante</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-100 p-4 dark:bg-slate-900">
                    <span className="text-xl font-bold">{state.usedTotal}</span>
                    <span className="block text-[9px] font-bold uppercase text-slate-600 dark:text-slate-300">Total utilisé</span>
                  </div>
                  <div className="bg-slate-100 p-4 dark:bg-slate-900">
                    <span className="text-xl font-bold">{state.activeUsers}</span>
                    <span className="block text-[9px] font-bold uppercase text-slate-600 dark:text-slate-300">Utilisateurs actifs</span>
                  </div>
                </div>
                <div className="bg-slate-100 p-4 dark:bg-slate-900">
                  <span className="text-xl font-bold">{openedCurrentPack}/{state.totalRolls}</span>
                  <span className="block text-[9px] font-bold uppercase text-slate-600 dark:text-slate-300">Rouleaux ouverts (pack actuel)</span>
                </div>

              </div>
            </section>

            <section className="md:col-span-12">
              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                <article className="border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                    Dernier acheteur
                  </p>
                  <h4 className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-50">
                    {state.lastBuyer}
                  </h4>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Cette personne a payé le paquet en cours.
                  </p>
                </article>

                <article className="border border-slate-200 bg-slate-100 p-5 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                    Prochain acheteur
                  </p>
                  <h4 className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-50">
                    {state.nextBuyer}
                  </h4>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Ce sera son tour au prochain paquet.
                  </p>
                </article>
              </div>

              <div className="mb-6 flex items-end justify-between">
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Journal des actions</h3>
                <span className="text-[10px] font-mono uppercase text-slate-600 dark:text-slate-300">Entrées: {state.roommates.length}</span>
              </div>
            </section>
          </div>

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

          <div className="md:hidden space-y-3">
            {state.roommates.map((roommate) => (
              <article
                className="flex items-center justify-between rounded-2xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-3"
                key={roommate.id}
              >
                <div className="flex items-center gap-3">
                  <img
                    alt={roommate.name}
                    className="h-10 w-10 cursor-pointer rounded-full object-cover transition-transform hover:scale-110 active:scale-95"
                    src={roommate.avatar}
                    onClick={() => handleAvatarClick(roommate.name)}
                  />
                  <div>
                    <p className="text-sm font-bold text-on-surface">{roommate.name}</p>
                    <p className="text-xs text-on-surface-variant">{roommate.opened} rouleaux</p>
                  </div>
                </div>
                {roommate.id === state.auth.currentUserId ? (
                  <button
                    className="rounded-full bg-primary px-3 py-2 text-xs font-bold text-on-primary"
                    onClick={() => onAddRoll(roommate.id)}
                    type="button"
                  >
                    +1
                  </button>
                ) : (
                  <span className="text-xs font-medium text-on-surface-variant">{roommate.lastActive}</span>
                )}
              </article>
            ))}
          </div>

          <div className="hidden md:grid md:grid-cols-2 md:gap-6 xl:grid-cols-4">
            {state.roommates.map((roommate) => (
              <RoommateCard
                isActiveUser={roommate.id === state.auth.currentUserId}
                isStockEmpty={state.rollsLeft === 0}
                key={roommate.id}
                roommate={roommate}
                onAddRoll={onAddRoll}
                onAvatarClick={() => handleAvatarClick(roommate.name)}
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
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:hidden">
        <div className="px-4 pb-2 pt-3">
        <button
          className="flex w-full items-center justify-center gap-2 bg-slate-900 px-6 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-50 dark:text-slate-900"
          disabled={!canValidateRoll || state.rollsLeft === 0}
          onClick={() => {
            if (state.auth.currentUserId) {
              onAddRoll(state.auth.currentUserId);
            }
          }}
          type="button"
        >
          <Icon name="plus" className="h-5 w-5" />
          j&apos;ai ouvert un rouleau
        </button>
      </div>
      </div>

      {/* EASTER EGG VIDEO GLOBALE */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setShowVideo(false)}
          >
            <video 
              src={wishIVideo} 
              autoPlay 
              playsInline
              onEnded={() => setShowVideo(false)}
              className="max-h-[70vh] max-w-lg rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex-shrink"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* EASTER EGG VIDEO ERWAN */}
      <AnimatePresence>
        {showIamVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            onClick={() => setShowIamVideo(false)}
          >
            <video 
              src={iamVideo} 
              autoPlay 
              playsInline
              onEnded={() => setShowIamVideo(false)}
              className="max-h-[70vh] max-w-lg rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex-shrink"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}