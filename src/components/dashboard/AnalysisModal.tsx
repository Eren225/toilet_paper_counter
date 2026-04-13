import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAllPacks, useAllUsages } from '../../hooks/queries/usePacks';
import Icon from './Icon';

type AnalysisModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type UsagePoint = {
  created_at: string;
  user?: {
    name?: string;
  } | null;
};

type IntervalPoint = {
  previousAt: string;
  currentAt: string;
  intervalMs: number;
  previousUser: string;
  currentUser: string;
};

type AnomalySeverity = 'mineure' | 'majeure' | 'critique';

type AnomalyPoint = IntervalPoint & {
  severity: AnomalySeverity;
  ratioVsNorm: number;
};

function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return '0 min';

  const minutes = Math.round(ms / 60000);
  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const mins = minutes % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} j`);
  if (hours > 0) parts.push(`${hours} h`);
  if (mins > 0 || parts.length === 0) parts.push(`${mins} min`);

  return parts.join(' ');
}

function computeMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

function getSeverity(intervalMs: number, avgIntervalMs: number): AnomalySeverity {
  if (avgIntervalMs <= 0) return 'mineure';
  const ratio = intervalMs / avgIntervalMs;
  if (ratio <= 0.1) return 'critique';
  if (ratio <= 0.25) return 'majeure';
  return 'mineure';
}

function severityBadgeClass(severity: AnomalySeverity): string {
  if (severity === 'critique') {
    return 'border-red-300 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/40 dark:text-red-200';
  }
  if (severity === 'majeure') {
    return 'border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-200';
  }
  return 'border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200';
}

export default function AnalysisModal({ isOpen, onClose }: AnalysisModalProps) {
  const { data: allUsages = [], isLoading: isLoadingUsages } = useAllUsages();
  const { data: allPacks = [], isLoading: isLoadingPacks } = useAllPacks();

  if (!isOpen) return null;

  if (isLoadingUsages || isLoadingPacks) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div className="border border-slate-200 bg-slate-50 px-6 py-4 text-sm font-bold uppercase tracking-widest text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50">
          Chargement des analyses...
        </div>
      </div>
    );
  }

  const usages = (allUsages as UsagePoint[])
    .filter((usage) => Number.isFinite(new Date(usage.created_at).getTime()))
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const dailyMap = usages.reduce<Record<string, number>>((acc, usage) => {
    const key = dayjs(usage.created_at).format('YYYY-MM-DD');
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const frequencyData = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, count]) => ({
      day: dayjs(day).format('DD/MM'),
      rolls: count,
    }));

  const intervals: IntervalPoint[] = [];
  for (let index = 1; index < usages.length; index += 1) {
    const previous = usages[index - 1];
    const current = usages[index];
    const delta = new Date(current.created_at).getTime() - new Date(previous.created_at).getTime();
    if (delta > 0) {
      intervals.push({
        previousAt: previous.created_at,
        currentAt: current.created_at,
        intervalMs: delta,
        previousUser: previous.user?.name || 'Inconnu',
        currentUser: current.user?.name || 'Inconnu',
      });
    }
  }

  const intervalValues = intervals.map((interval) => interval.intervalMs);
  const avgIntervalMs = intervalValues.length > 0
    ? intervalValues.reduce((sum, value) => sum + value, 0) / intervalValues.length
    : 0;
  const medianIntervalMs = computeMedian(intervalValues);

  const stdDevMs = intervalValues.length > 0
    ? Math.sqrt(
      intervalValues.reduce((sum, value) => {
        const diff = value - avgIntervalMs;
        return sum + diff * diff;
      }, 0) / intervalValues.length,
    )
    : 0;

  const anomalyThresholdMs = avgIntervalMs > 0 ? avgIntervalMs * 0.25 : 0;

  const anomalies: AnomalyPoint[] = intervals
    .filter((interval) => {
      const veryFastVsNorm = anomalyThresholdMs > 0 && interval.intervalMs <= anomalyThresholdMs;
      const zScoreAlert = stdDevMs > 0 && ((avgIntervalMs - interval.intervalMs) / stdDevMs) >= 2;
      return veryFastVsNorm || zScoreAlert;
    })
    .map((interval) => {
      const ratioVsNorm = avgIntervalMs > 0 ? interval.intervalMs / avgIntervalMs : 1;
      return {
        ...interval,
        ratioVsNorm,
        severity: getSeverity(interval.intervalMs, avgIntervalMs),
      };
    });

  const anomaliesBySeverity = anomalies.reduce<Record<AnomalySeverity, number>>((acc, anomaly) => {
    acc[anomaly.severity] += 1;
    return acc;
  }, {
    mineure: 0,
    majeure: 0,
    critique: 0,
  });

  const recentAnomalies = [...anomalies]
    .sort((a, b) => new Date(b.currentAt).getTime() - new Date(a.currentAt).getTime())
    .slice(0, 10);

  const periodStart = usages.length > 0 ? dayjs(usages[0].created_at).format('DD MMM YYYY') : '-';
  const periodEnd = usages.length > 0 ? dayjs(usages[usages.length - 1].created_at).format('DD MMM YYYY') : '-';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 32, scale: 0.98 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 26, stiffness: 260 }}
          className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden border border-slate-200 bg-slate-50 text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50"
        >
          <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider">Analyses Long Terme</h2>
              <p className="text-xs uppercase tracking-widest text-slate-600 dark:text-slate-300">
                Détection d&apos;incohérences par rapport à la norme de consommation
              </p>
            </div>
            <button
              className="p-2 transition hover:opacity-70"
              onClick={onClose}
              type="button"
            >
              <Icon name="history" />
              <span className="sr-only">Fermer les analyses</span>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <article className="border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">Total usages</p>
                <p className="mt-2 text-2xl font-black">{usages.length}</p>
              </article>
              <article className="border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">Packs analysés</p>
                <p className="mt-2 text-2xl font-black">{allPacks.length}</p>
              </article>
              <article className="border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">Norme moyenne</p>
                <p className="mt-2 text-xl font-black">{avgIntervalMs > 0 ? formatDuration(avgIntervalMs) : '-'}</p>
              </article>
              <article className="border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">Anomalies détectées</p>
                <p className="mt-2 text-2xl font-black">{anomalies.length}</p>
              </article>
            </div>

            <section className="mb-8 border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Fréquence des rouleaux ouverts</h3>
                <span className="text-[10px] font-mono uppercase text-slate-600 dark:text-slate-300">
                  Période: {periodStart} {'->'} {periodEnd}
                </span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={frequencyData}>
                    <CartesianGrid strokeDasharray="4 4" opacity={0.25} />
                    <XAxis dataKey="day" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      labelFormatter={(value) => `Jour ${value}`}
                      formatter={(value) => [String(value ?? ''), 'Rouleaux ouverts']}
                    />
                    <Line type="monotone" dataKey="rolls" stroke="#0f172a" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Incohérences détectées</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Norme: 1 ouverture toutes {avgIntervalMs > 0 ? formatDuration(avgIntervalMs) : '-'} (médiane: {medianIntervalMs > 0 ? formatDuration(medianIntervalMs) : '-'})
                </p>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-950">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">Mineures</p>
                  <p className="mt-1 text-xl font-black">{anomaliesBySeverity.mineure}</p>
                </div>
                <div className="border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-800/70 dark:bg-amber-950/30">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300">Majeures</p>
                  <p className="mt-1 text-xl font-black text-amber-800 dark:text-amber-200">{anomaliesBySeverity.majeure}</p>
                </div>
                <div className="border border-red-200 bg-red-50 p-3 text-sm dark:border-red-800/70 dark:bg-red-950/30">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-700 dark:text-red-300">Critiques</p>
                  <p className="mt-1 text-xl font-black text-red-800 dark:text-red-200">{anomaliesBySeverity.critique}</p>
                </div>
              </div>

              {recentAnomalies.length === 0 ? (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Aucune anomalie détectée pour le moment sur la période analysée.
                </p>
              ) : (
                <ul className="space-y-3">
                  {recentAnomalies.map((anomaly) => (
                    <li
                      className="border border-red-200 bg-red-50 p-3 text-sm dark:border-red-900/70 dark:bg-red-950/30"
                      key={`${anomaly.previousAt}-${anomaly.currentAt}-${anomaly.currentUser}`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-red-700 dark:text-red-300">
                          {dayjs(anomaly.currentAt).format('DD/MM HH:mm')} - Ouverture inhabituelle
                        </p>
                        <span className={`inline-flex items-center border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${severityBadgeClass(anomaly.severity)}`}>
                          {anomaly.severity}
                        </span>
                      </div>
                      <p className="mt-1 text-slate-700 dark:text-slate-200">
                        {anomaly.currentUser} a ouvert un rouleau {formatDuration(anomaly.intervalMs)} après {anomaly.previousUser},
                        alors que la norme est de {formatDuration(avgIntervalMs)} ({Math.round(anomaly.ratioVsNorm * 100)}% de la norme).
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
