'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') || '/dashboard'
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Login failed'); return }
      router.push(redirect)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 32 }}>
            <span style={{ fontSize: 24 }}>🛂</span>
            <span style={{ color: '#d4af37', fontWeight: 800, fontSize: 20 }}>ITS-R Passport</span>
          </a>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ color: '#64748b', fontSize: 15 }}>Sign in to your Passport</p>
        </div>

        <div style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 16, padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Email</label>
              <input className="input-field" type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6, display: 'flex', justifyContent: 'space-between' } as React.CSSProperties}>
                <span>Password</span>
                <a href="/forgot-password" style={{ color: '#d4af37', fontSize: 12, textDecoration: 'none', fontWeight: 500 }}>Forgot?</a>
              </label>
              <input className="input-field" type="password" placeholder="Your password" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#f87171', fontSize: 14 }}>
                {error}
              </div>
            )}

            <button className="btn-gold" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14, marginTop: 20 }}>
          Don&apos;t have a Passport?{' '}
          <a href="/register" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 600 }}>Create one</a>
        </p>
      </div>
    </div>
  )
}

export default function Login() {
  return <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0f' }} />}><LoginForm /></Suspense>
}
