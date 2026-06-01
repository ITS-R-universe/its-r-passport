'use client'
import { useState, useEffect } from 'react'

export default function ForgotPasswordPage() {
  const [dark, setDark] = useState(true)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const t = localStorage.getItem('its-r-theme')
    const isDark = t !== 'light'
    setDark(isDark)
    if (!isDark) document.documentElement.setAttribute('data-theme', 'light')
  }, [])

  const toggleTheme = () => {
    const next = !dark; setDark(next)
    if (next) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('its-r-theme','dark') }
    else { document.documentElement.setAttribute('data-theme','light'); localStorage.setItem('its-r-theme','light') }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      if (res.ok) setSent(true)
      else { const d = await res.json(); setError(d.error || 'Failed') }
    } catch { setError('Something went wrong') }
    finally { setLoading(false) }
  }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text)',display:'flex',flexDirection:'column',fontFamily:'system-ui,sans-serif'}}>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 2rem',borderBottom:'1px solid var(--border)'}}>
        <span style={{color:'var(--gold)',fontWeight:800}}>🛂 ITS-R Passport</span>
        <button onClick={toggleTheme} style={{background:'var(--card)',border:'1px solid var(--border)',color:'var(--text)',padding:'0.4rem 0.75rem',borderRadius:'0.5rem',cursor:'pointer',fontSize:'0.8rem'}}>{dark?'☀️ Day':'🌙 Night'}</button>
      </nav>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
        {sent ? (
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'3rem',marginBottom:'1rem'}}>📧</div>
            <h2 style={{marginBottom:'0.5rem'}}>Email Sent!</h2>
            <p style={{color:'var(--sub)',marginBottom:'1.5rem'}}>Check your inbox for the reset link</p>
            <a href="/login" style={{color:'var(--gold)'}}>← Back to Sign In</a>
          </div>
        ) : (
          <div style={{width:'100%',maxWidth:400}}>
            <div style={{textAlign:'center',marginBottom:'2rem'}}>
              <h1 style={{fontSize:'1.75rem',fontWeight:700,marginBottom:'0.5rem'}}>Reset Password</h1>
              <p style={{color:'var(--sub)',fontSize:'0.875rem'}}>Enter your email to receive a reset link</p>
            </div>
            <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'1rem',padding:'2rem'}}>
              {error && <div style={{background:'#ef444422',border:'1px solid #ef4444',color:'#ef4444',borderRadius:'0.5rem',padding:'0.75rem',marginBottom:'1rem',fontSize:'0.875rem'}}>{error}</div>}
              <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                <div>
                  <label style={{display:'block',fontSize:'0.8rem',color:'var(--sub)',marginBottom:'0.375rem'}}>Email Address</label>
                  <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={{width:'100%',padding:'0.75rem 1rem',background:'var(--input-bg)',border:'1px solid var(--border)',borderRadius:'0.5rem',color:'var(--text)',fontSize:'0.9rem',outline:'none'}} />
                </div>
                <button type="submit" disabled={loading} style={{width:'100%',padding:'0.75rem',background:'var(--gold)',color:'#000',fontWeight:700,border:'none',borderRadius:'0.5rem',cursor:loading?'not-allowed':'pointer',opacity:loading?0.7:1}}>
                  {loading?'Sending...':'Send Reset Link'}
                </button>
              </form>
              <p style={{textAlign:'center',marginTop:'1rem',fontSize:'0.8rem'}}>
                <a href="/login" style={{color:'var(--sub)',textDecoration:'none'}}>← Back to Sign In</a>
              </p>
            </div>
            <p style={{textAlign:'center',marginTop:'1.5rem',fontSize:'0.75rem',color:'var(--sub)'}}>ITS-R Universe • In loving memory of Roshan Ali Sahab 🤲</p>
          </div>
        )}
      </div>
    </div>
  )
}
