import { useState, type FormEvent } from 'react'
import { Loader2, Lock, Mail } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos.'
          : error.message,
      )
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 text-xs font-bold text-white">
            FS
          </div>
          <div>
            <h1 className="text-base font-semibold text-white tracking-tight">
              Full Sales System
            </h1>
            <p className="text-xs text-[var(--color-muted)]">Dashboard interno</p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
        >
          <h2 className="mb-1 text-sm font-medium text-white">Entrar</h2>
          <p className="mb-5 text-xs text-[var(--color-muted)]">
            Acesse com sua conta da equipe.
          </p>

          <label className="mb-3 block">
            <span className="mb-1 block text-xs text-[var(--color-muted)]">
              E-mail
            </span>
            <div className="relative">
              <Mail
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
              />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-2)] py-2 pl-9 pr-3 text-sm outline-none focus:border-white/20"
                placeholder="voce@fullsalessystem.com"
              />
            </div>
          </label>

          <label className="mb-4 block">
            <span className="mb-1 block text-xs text-[var(--color-muted)]">
              Senha
            </span>
            <div className="relative">
              <Lock
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
              />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-2)] py-2 pl-9 pr-3 text-sm outline-none focus:border-white/20"
                placeholder="••••••••"
              />
            </div>
          </label>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Entrar
          </button>
        </form>

        <p className="mt-4 text-center text-[10px] text-[var(--color-muted)]">
          Acesso restrito. Solicite credenciais ao administrador.
        </p>
      </div>
    </div>
  )
}
