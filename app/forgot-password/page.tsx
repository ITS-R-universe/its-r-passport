'use client'
import { useState } from 'react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) { setSent(true) } else {
        const d = await res.json()
        setError(d.error || 'Failed to send reset email')
      }
    } catch {
      setError('Something went wrong')
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
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Reset Password</h1>
        </div>

        {sent ? (
          <div style={{ background: '#0d1117', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 16, padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <p style={{ color: '#34d399', fontWeight: 600, marginBottom: 8 }}>Reset link sent!</p>
            <p style={{ color: '#64748b', fontSize: 14 }}>Check your email for the password reset link.</p>
          </div>
        ) : (
          <div style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 16, padding: 32 }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>Enter your email and we'll send you a reset link.</p>
              <input className="input-field" type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} required />
              {error && <div style={{ color: '#f87171', fontSize: 14 }}>{error}</div>}
              <button className="btn-gold" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </div>
        )}
        <p style={{ textAlign: 'center', marginTop: 20 }}>
          <a href="/login" style={{ color: '#64748b', fontSize: 14, textDecoration: 'none' }}>← Back to Sign In</a>
        </p>
      </div>
    </div>
  )
}
