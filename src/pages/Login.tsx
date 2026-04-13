import { useState } from 'react';
import { useSignIn } from '../hooks/queries/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signInMutation = useSignIn();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      signInMutation.mutate({ email, password });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-on-surface">
      <div className="w-full max-w-md rounded-[2rem] bg-surface-container-lowest p-8 shadow-[0_24px_48px_rgba(0,43,82,0.06)] border border-outline-variant/10">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-primary-container))] text-xl font-bold text-on-primary shadow-[0_16px_40px_rgba(0,96,173,0.25)]">
            PQ
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.28em] text-secondary">4eme 204</p>
          <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-on-surface">
            Connexion
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">Accédez à votre compte pour gérer la consommation de rouleaux.</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            className="w-full rounded-full bg-surface-container-low px-5 py-4 text-sm font-medium outline-none transition focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (@4eme204.local)"
            required
            type="email"
            value={email}
          />
          <input
            className="w-full rounded-full bg-surface-container-low px-5 py-4 text-sm font-medium outline-none transition focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            type="password"
            value={password}
          />
          <button
            className="mt-4 w-full rounded-full bg-[linear-gradient(135deg,var(--color-primary),var(--color-primary-container))] px-6 py-4 text-sm font-bold text-on-primary shadow-[0_12px_30px_rgba(0,96,173,0.28)] transition hover:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={signInMutation.isPending}
            type="submit"
          >
            {signInMutation.isPending ? 'Connexion en cours...' : 'Se connecter'}
          </button>

          {signInMutation.isError && (
            <p className="mt-4 text-center text-sm font-medium text-red-500">
              Identifiants incorrects.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}