import { createClient } from '@supabase/supabase-js';

// ✅ Ce fichier rassemble UNIQUEMENT la logique de communication avec Supabase (Base de données, Auth).
// ❌ AUCUN code UI ou React (JSX) ne doit se trouver ici.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquante dans le fichier .env !");
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

