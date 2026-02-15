/**
 * Server-side Supabase client.
 *
 * In a Next.js App Router setup, this would use createServerClient from @supabase/ssr
 * with cookies() from next/headers. Since GradePilot currently runs as a Vite SPA,
 * this file serves as the canonical pattern for when the project migrates to Next.js.
 *
 * --- Next.js App Router Pattern (reference) ---
 *
 *   import { createServerClient } from '@supabase/ssr';
 *   import { cookies } from 'next/headers';
 *
 *   export async function createClient() {
 *     const cookieStore = await cookies();
 *     return createServerClient(
 *       process.env.NEXT_PUBLIC_SUPABASE_URL,
 *       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
 *       {
 *         cookies: {
 *           getAll() { return cookieStore.getAll(); },
 *           setAll(cookiesToSet) {
 *             cookiesToSet.forEach(({ name, value, options }) =>
 *               cookieStore.set(name, value, options)
 *             );
 *           },
 *         },
 *       }
 *     );
 *   }
 *
 * For now, this re-exports the browser client so imports remain consistent.
 */

import { createClient as createBrowserClient } from './client';

export function createClient() {
  // In SPA mode, delegate to the browser client
  return createBrowserClient();
}

export default createClient;
