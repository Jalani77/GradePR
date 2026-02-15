import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for use in the browser (client-side).
 * Uses @supabase/ssr createBrowserClient which handles cookie-based auth
 * in a way that's compatible with SSR frameworks (Next.js App Router pattern).
 *
 * Environment variables:
 *   VITE_SUPABASE_URL - Your Supabase project URL
 *   VITE_SUPABASE_ANON_KEY - Your Supabase anon/public key
 */
export function createClient() {
  return createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL ?? '',
    import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''
  );
}

/**
 * Singleton instance for convenience.
 * Re-uses a single client instance across the app.
 */
let _supabase = null;

export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient();
  }
  return _supabase;
}

export default createClient;
