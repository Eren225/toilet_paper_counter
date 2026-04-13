import { useAllPacks, useAllUsages } from '../../hooks/queries/usePacks';
import dayjs from 'dayjs';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import Icon from './Icon';

type HistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const COLORS = ['#0060AD', '#136D41', '#F59E0B', '#E11D48', '#8B5CF6'];

export default function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const { data: packs, isLoading: isLoadingPacks } = useAllPacks();
  const { data: usages, isLoading: isLoadingUsages } = useAllUsages();

  if (!isOpen) return null;

  if (isLoadingPacks || isLoadingUsages) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="rounded-3xl bg-surface p-8 text-center text-on-surface">
          Chargement de l'historique...
        </div>
      </div>
    );
  }

  // 1. Données pour le Graphique de Consommation Globale (Pie Chart)
  const usageByUser = (usages || []).reduce((acc, usage) => {
    const name = usage.user?.name || 'Inconnu';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(usageByUser).map(([name, value]) => ({ name, value }));

  // 2. Données pour l'historique des achats (Bar Chart)
  const purchasesByUser = (packs || []).reduce((acc, pack) => {
    const name = pack.buyer?.name || 'Inconnu';
    acc[name] = (acc[name] || 0) + pack.total_rolls;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(purchasesByUser).map(([name, rolls]) => ({ name, rolls }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] bg-surface text-on-surface shadow-2xl">
        <header className="flex items-center justify-between border-b border-outline-variant/30 px-8 py-6">
          <div>
            <h2 className="text-2xl font-black text-on-surface">Historique de la Coloc</h2>
            <p className="text-sm text-on-surface-variant">Statistiques globales depuis le début</p>
          </div>
          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-surface-container-high transition hover:bg-surface-container-highest"
          >
            <Icon name="history" /> {/* Un faux bouton close, mettons history pour fake en attendant, id: 'close' n'est pas certain */}
            <span className="sr-only">Fermer</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            
            {/* Colonne 1: Consommation */}
            <section className="rounded-3xl bg-surface-container-low p-6">
              <h3 className="mb-4 text-center text-lg font-bold">Consommation Totale (Rouleaux)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Colonne 2: Achats (Investissement) */}
            <section className="rounded-3xl bg-surface-container-low p-6">
              <h3 className="mb-4 text-center text-lg font-bold">Rouleaux Achetés par Personne</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rolls" fill="#136D41" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          {/* Tableau historique paquets */}
          <section className="mt-8">
            <h3 className="mb-4 text-xl font-bold">Historique des paquets</h3>
            <div className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-low">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-container-high font-bold text-on-surface">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Acheteur</th>
                    <th className="px-6 py-3">Quantité</th>
                    <th className="px-6 py-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {(packs || []).map((pack) => (
                    <tr key={pack.id} className="transition hover:bg-surface-container">
                      <td className="px-6 py-4">{dayjs(pack.created_at).format('DD MMM YYYY')}</td>
                      <td className="px-6 py-4 font-medium">{pack.buyer?.name}</td>
                      <td className="px-6 py-4">{pack.total_rolls} rouleaux</td>
                      <td className="px-6 py-4">
                        {pack.is_active 
                          ? <span className="inline-flex rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">Actif</span>
                          : <span className="inline-flex rounded-full bg-surface-container-highest px-2 py-1 text-xs font-medium text-on-surface-variant">Terminé</span>
                        }
                      </td>
                    </tr>
                  ))}
                  {packs?.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-on-surface-variant">Aucun historique disponible.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <footer className="border-t border-outline-variant/30 p-4 text-center">
          <button
            onClick={onClose}
            className="rounded-full bg-primary px-8 py-3 font-bold text-on-primary shadow-lg transition hover:scale-[0.98]"
          >
            Fermer l'historique
          </button>
        </footer>
      </div>
    </div>
  );
}