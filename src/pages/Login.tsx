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
      <div className="w-full max-w-md border border-outline-variant bg-surface-container-lowest p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="grid h-14 w-14 place-items-center bg-primary text-xl font-bold text-on-primary">
            PQ
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.28em] text-on-surface-variant">4eme 204</p>
          <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-on-surface">
            TP-LEDGER-V1
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">Connexion au système de suivi.</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            className="w-full bg-surface-container-low px-5 py-4 text-sm font-medium outline-none transition focus:bg-surface-container"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (@4eme204.local)"
            required
            type="email"
            value={email}
          />
          <input
            className="w-full bg-surface-container-low px-5 py-4 text-sm font-medium outline-none transition focus:bg-surface-container"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            type="password"
            value={password}
          />
          <button
            className="mt-4 w-full bg-primary px-6 py-4 text-sm font-bold uppercase tracking-widest text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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