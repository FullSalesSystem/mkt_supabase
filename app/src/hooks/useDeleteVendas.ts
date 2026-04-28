import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, VENDAS_TABLE } from '../lib/supabase'

async function deleteVendas(ids: (string | number)[]) {
  if (!ids.length) return 0
  const { error, count } = await supabase
    .from(VENDAS_TABLE)
    .delete({ count: 'exact' })
    .in('id', ids)
  if (error) throw error
  return count ?? ids.length
}

export function useDeleteVendas() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteVendas,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vendas'] })
    },
  })
}
