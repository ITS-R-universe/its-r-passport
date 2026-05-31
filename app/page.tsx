import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1e293b', background: 'rgba(13,17,23,0.9)', padding: '0 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>🛂</span>
            <span style={{ color: '#d4af37', fontWeight: 800, fontSize: 20 }}>ITS-R Passport</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="/login" style={{ padding: '8px 18px', color: '#94a3b8', fontSize: 14, textDecoration: 'none', border: '1px solid #1e293b', borderRadius: 8 }}>Sign In</a>
            <a href="/register" style={{ padding: '8px 18px', background: '#d4af37', color: '#000', fontSize: 14, fontWeight: 700, textDecoration: 'none', borderRadius: 8 }}>Create Passport</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main style={{ flex: 1, maxWidth: 1200, margin: '0 auto', padding: '5rem 1.5rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 100, marginBottom: 24 }}>
            <span style={{ color: '#d4af37', fontSize: 13, fontWeight: 600 }}>Your Digital Identity</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
            One Passport.<br /><span style={{ color: '#d4af37' }}>Unlimited Access.</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Your ITS-R Passport is your universal identity across the entire ITS-R Universe.
            One ID. Every service. No limits.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/register" style={{ padding: '14px 32px', background: '#d4af37', color: '#000', fontWeight: 700, fontSize: 16, borderRadius: 10, textDecoration: 'none' }}>
              Create Your Passport →
            </a>
            <a href="/login" style={{ padding: '14px 32px', background: '#0d1117', color: '#e2e8f0', fontWeight: 600, fontSize: 16, borderRadius: 10, textDecoration: 'none', border: '1px solid #1e293b' }}>
              Sign In
            </a>
          </div>
        </div>

        {/* Passport Card Preview */}
        <div style={{ maxWidth: 400, margin: '0 auto 5rem', background: 'linear-gradient(135deg, #1a1a2e, #0d1117)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 20, padding: 32, boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <div style={{ color: '#d4af37', fontWeight: 800, fontSize: 16, letterSpacing: 2 }}>ITS-R</div>
              <div style={{ color: '#94a3b8', fontSize: 11, letterSpacing: 1 }}>UNIVERSE PASSPORT</div>
            </div>
            <span style={{ fontSize: 32 }}>🛂</span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: '#64748b', fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>PASSPORT ID</div>
            <div style={{ color: '#d4af37', fontFamily: 'monospace', fontSize: 22, fontWeight: 700, letterSpacing: 4 }}>ITSR-XXXX-XXXX</div>
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>HOLDER</div>
            <div style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 600 }}>Your Name Here</div>
          </div>
          <div style={{ marginTop: 24, height: 2, background: 'linear-gradient(90deg, #d4af37, transparent)' }} />
          <div style={{ marginTop: 12, color: '#334155', fontSize: 10, letterSpacing: 1 }}>
            ITS-R UNIVERSE — IN LOVING MEMORY OF ROSHAN ALI SAHAB
          </div>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { icon: '🔐', title: 'Single Sign-On', desc: 'One login for all ITS-R services. Register once, access everything.' },
            { icon: '🆔', title: 'Unique Passport ID', desc: 'Your personal ITSR-XXXX-XXXX ID — your identity in the universe.' },
            { icon: '🛡️', title: 'Secure & Private', desc: 'bcrypt passwords, JWT sessions, 2FA support. Your data is yours.' },
          ].map(f => (
            <div key={f.title} style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ borderTop: '1px solid #1e293b', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#475569', fontSize: 14 }}>ITS-R Universe</p>
        <p style={{ color: '#334155', fontSize: 12, marginTop: 4 }}>In loving memory of Roshan Ali Sahab</p>
      </footer>
    </div>
  )
}
