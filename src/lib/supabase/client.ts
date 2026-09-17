import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/database.types"

/**
 * Cliente de Supabase para Componentes de Cliente ("use client").
 * Usa las claves publicas (anon key) -- la seguridad real la aplica RLS
 * en la base de datos, no este cliente.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
