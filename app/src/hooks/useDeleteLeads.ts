import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, TABLE } from '../lib/supabase'

async function deleteLeads(ids: (string | number)[]) {
  if (!ids.length) return 0
  const { error, count } = await supabase
    .from(TABLE)
    .delete({ count: 'exact' })
    .in('id', ids)
  if (error) throw error
  return count ?? ids.length
}

export function useDeleteLeads() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteLeads,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}
