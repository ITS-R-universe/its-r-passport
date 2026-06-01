'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') || '/dashboard'
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dark, setDark] = useState(true)

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
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Login failed'); return }
      router.push(redirect)
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  const inp = { width:'100%',padding:'0.75rem 1rem',background:'var(--input-bg)',border:'1px solid var(--border)',borderRadius:'0.5rem',color:'var(--text)',fontSize:'0.9rem',outline:'none' }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',flexDirection:'column'}}>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 2rem',borderBottom:'1px solid var(--border)'}}>
        <span style={{color:'var(--gold)',fontWeight:800,fontSize:'1.1rem'}}>🛂 ITS-R Passport</span>
        <button onClick={toggleTheme} style={{background:'var(--card)',border:'1px solid var(--border)',color:'var(--text)',padding:'0.4rem 0.75rem',borderRadius:'0.5rem',cursor:'pointer',fontSize:'0.8rem'}}>
          {dark?'☀️ Day':'🌙 Night'}
        </button>
      </nav>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
        <div style={{width:'100%',maxWidth:400}}>
          <div style={{textAlign:'center',marginBottom:'2rem'}}>
            <h1 style={{fontSize:'1.75rem',fontWeight:700,marginBottom:'0.5rem'}}>Welcome Back</h1>
            <p style={{color:'var(--sub)',fontSize:'0.875rem'}}>Sign in to your ITS-R Passport</p>
          </div>
          <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'1rem',padding:'2rem'}}>
            {error && <div style={{background:'#ef444422',border:'1px solid #ef4444',color:'#ef4444',borderRadius:'0.5rem',padding:'0.75rem',marginBottom:'1rem',fontSize:'0.875rem'}}>{error}</div>}
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div>
                <label style={{display:'block',fontSize:'0.8rem',color:'var(--sub)',marginBottom:'0.375rem'}}>Email</label>
                <input type="email" required value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="you@example.com" style={inp} />
              </div>
              <div>
                <label style={{display:'block',fontSize:'0.8rem',color:'var(--sub)',marginBottom:'0.375rem'}}>Password</label>
                <input type="password" required value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="••••••••" style={inp} />
              </div>
              <button type="submit" disabled={loading} style={{width:'100%',padding:'0.75rem',background:'var(--gold)',color:'#000',fontWeight:700,border:'none',borderRadius:'0.5rem',cursor:loading?'not-allowed':'pointer',fontSize:'0.9rem',opacity:loading?0.7:1}}>
                {loading?'Signing in...':'Sign In'}
              </button>
            </form>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:'1rem',fontSize:'0.8rem'}}>
              <a href="/forgot-password" style={{color:'var(--sub)',textDecoration:'none'}}>Forgot password?</a>
              <a href="/register" style={{color:'var(--gold)',textDecoration:'none'}}>Create account →</a>
            </div>
          </div>
          <p style={{textAlign:'center',marginTop:'1.5rem',fontSize:'0.75rem',color:'var(--sub)'}}>
            ITS-R Universe • In loving memory of Roshan Ali Sahab 🤲
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
