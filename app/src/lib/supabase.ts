import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Missing Supabase env vars. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY em .env.local',
  )
}

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
})

export const TABLE = import.meta.env.VITE_SUPABASE_TABLE || 'geral'
export const VENDAS_TABLE =
  import.meta.env.VITE_SUPABASE_VENDAS_TABLE || '[Compradores] [Ticto] Vendas'
