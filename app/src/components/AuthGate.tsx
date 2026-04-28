import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Login } from './Login'

export function AuthGate({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--color-muted)]">
        <Loader2 size={20} className="animate-spin" />
      </div>
    )
  }

  if (!session) return <Login />

  return <>{children}</>
}
