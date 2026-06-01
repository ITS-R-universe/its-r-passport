'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [dark, setDark] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

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
    e.preventDefault(); setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed'); return }
      setSuccess(true)
    } catch { setError('Something went wrong.') }
    finally { setLoading(false) }
  }

  const inp = { width:'100%',padding:'0.75rem 1rem',background:'var(--input-bg)',border:'1px solid var(--border)',borderRadius:'0.5rem',color:'var(--text)',fontSize:'0.9rem',outline:'none' }

  if (success) return (
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'system-ui,sans-serif'}}>
      <div style={{textAlign:'center',maxWidth:400}}>
        <div style={{fontSize:'3rem',marginBottom:'1rem'}}>✅</div>
        <h2 style={{color:'var(--text)',marginBottom:'0.5rem'}}>Check Your Email</h2>
        <p style={{color:'var(--sub)',marginBottom:'1.5rem'}}>We sent a verification link to {form.email}</p>
        <a href="/login" style={{color:'var(--gold)'}}>Go to Sign In →</a>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text)',display:'flex',flexDirection:'column',fontFamily:'system-ui,sans-serif'}}>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 2rem',borderBottom:'1px solid var(--border)'}}>
        <span style={{color:'var(--gold)',fontWeight:800}}>🛂 ITS-R Passport</span>
        <button onClick={toggleTheme} style={{background:'var(--card)',border:'1px solid var(--border)',color:'var(--text)',padding:'0.4rem 0.75rem',borderRadius:'0.5rem',cursor:'pointer',fontSize:'0.8rem'}}>{dark?'☀️ Day':'🌙 Night'}</button>
      </nav>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
        <div style={{width:'100%',maxWidth:420}}>
          <div style={{textAlign:'center',marginBottom:'2rem'}}>
            <h1 style={{fontSize:'1.75rem',fontWeight:700,marginBottom:'0.5rem'}}>Create Account</h1>
            <p style={{color:'var(--sub)',fontSize:'0.875rem'}}>Join ITS-R Universe</p>
          </div>
          <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'1rem',padding:'2rem'}}>
            {error && <div style={{background:'#ef444422',border:'1px solid #ef4444',color:'#ef4444',borderRadius:'0.5rem',padding:'0.75rem',marginBottom:'1rem',fontSize:'0.875rem'}}>{error}</div>}
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              {[['Full Name','text','name','Your full name'],['Email','email','email','you@example.com'],['Password','password','password','Min 8 characters'],['Confirm Password','password','confirm','Repeat password']].map(([label,type,key,ph])=>(
                <div key={key as string}>
                  <label style={{display:'block',fontSize:'0.8rem',color:'var(--sub)',marginBottom:'0.375rem'}}>{label as string}</label>
                  <input type={type as string} required value={form[key as keyof typeof form]} onChange={e=>setForm(f=>({...f,[key as string]:e.target.value}))} placeholder={ph as string} style={inp} />
                </div>
              ))}
              <button type="submit" disabled={loading} style={{width:'100%',padding:'0.75rem',background:'var(--gold)',color:'#000',fontWeight:700,border:'none',borderRadius:'0.5rem',cursor:loading?'not-allowed':'pointer',opacity:loading?0.7:1}}>
                {loading?'Creating...':'Create Account'}
              </button>
            </form>
            <p style={{textAlign:'center',marginTop:'1rem',fontSize:'0.8rem',color:'var(--sub)'}}>
              Already have an account? <a href="/login" style={{color:'var(--gold)'}}>Sign in</a>
            </p>
          </div>
          <p style={{textAlign:'center',marginTop:'1.5rem',fontSize:'0.75rem',color:'var(--sub)'}}>
            ITS-R Universe • In loving memory of Roshan Ali Sahab 🤲
          </p>
        </div>
      </div>
    </div>
  )
}
