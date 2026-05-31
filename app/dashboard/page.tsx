import { getCurrentUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const user = await getCurrentUser()
  if (!user) redirect('/login?redirect=/dashboard')

  const [historyRes, sessionsRes] = await Promise.all([
    supabaseAdmin.from('its_r_login_history').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabaseAdmin.from('its_r_sessions').select('*').eq('user_id', user.id).gt('expires_at', new Date().toISOString()).limit(10)
  ])

  const history = historyRes.data || []
  const sessions = sessionsRes.data || []

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <header style={{ borderBottom: '1px solid #1e293b', background: '#0d1117', padding: '0 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>🛂</span>
            <span style={{ color: '#d4af37', fontWeight: 800, fontSize: 18 }}>ITS-R Passport</span>
          </div>
          <form action="/api/auth/logout" method="post">
            <button type="submit" style={{ padding: '7px 16px', background: 'transparent', border: '1px solid #1e293b', color: '#94a3b8', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Passport Card */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0d1117)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 20, padding: 32, marginBottom: 32, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
            <div>
              <div style={{ color: '#d4af37', fontWeight: 800, fontSize: 18, letterSpacing: 2 }}>ITS-R</div>
              <div style={{ color: '#94a3b8', fontSize: 11, letterSpacing: 1 }}>UNIVERSE PASSPORT</div>
            </div>
            <span style={{ fontSize: 36 }}>🛂</span>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: '#64748b', fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>PASSPORT ID</div>
            <div style={{ color: '#d4af37', fontFamily: 'monospace', fontSize: 28, fontWeight: 700, letterSpacing: 4 }}>{(user as { passport_id: string }).passport_id}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <div style={{ color: '#64748b', fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>FULL NAME</div>
              <div style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 600 }}>{(user as { full_name: string }).full_name}</div>
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>EMAIL</div>
              <div style={{ color: '#e2e8f0', fontSize: 14 }}>{(user as { email: string }).email}</div>
            </div>
          </div>
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            {(user as { email_verified: boolean }).email_verified ? (
              <span style={{ color: '#34d399', fontSize: 12, padding: '3px 10px', background: 'rgba(52,211,153,0.1)', borderRadius: 100, border: '1px solid rgba(52,211,153,0.2)' }}>✓ Verified</span>
            ) : (
              <span style={{ color: '#fbbf24', fontSize: 12, padding: '3px 10px', background: 'rgba(251,191,36,0.1)', borderRadius: 100, border: '1px solid rgba(251,191,36,0.2)' }}>⚠ Email not verified</span>
            )}
          </div>
          <div style={{ marginTop: 20, height: 1, background: 'linear-gradient(90deg, rgba(212,175,55,0.3), transparent)' }} />
          <div style={{ marginTop: 10, color: '#334155', fontSize: 10, letterSpacing: 1 }}>ITS-R UNIVERSE — IN LOVING MEMORY OF ROSHAN ALI SAHAB</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Login History */}
          <div style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 16, padding: 24 }}>
            <h2 style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Recent Sign-Ins</h2>
            {history.length === 0 ? <p style={{ color: '#64748b', fontSize: 14 }}>No history yet</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {history.map((h: { id: string; success: boolean; ip_address: string; created_at: string }) => (
                  <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1e293b' }}>
                    <div>
                      <span style={{ color: h.success ? '#34d399' : '#f87171', fontSize: 13, fontWeight: 600 }}>{h.success ? '✓ Success' : '✗ Failed'}</span>
                      <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>{h.ip_address}</div>
                    </div>
                    <div style={{ color: '#475569', fontSize: 11 }}>{new Date(h.created_at).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 16, padding: 24 }}>
            <h2 style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: '🌐 ITS-R Portal', href: 'https://its-r-portal.vercel.app' },
                { label: '📊 Dashboard', href: 'https://its-r-dashboard.vercel.app' },
                { label: '👁️ Monitor', href: 'https://its-r-monitor.vercel.app' },
              ].map(a => (
                <a key={a.label} href={a.href} style={{ padding: '10px 14px', background: '#0a0a0f', border: '1px solid #1e293b', borderRadius: 8, color: '#e2e8f0', textDecoration: 'none', fontSize: 14, transition: 'border-color 0.2s' }}>
                  {a.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid #1e293b', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#475569', fontSize: 14 }}>ITS-R Universe</p>
        <p style={{ color: '#334155', fontSize: 12, marginTop: 4 }}>In loving memory of Roshan Ali Sahab</p>
      </footer>
    </div>
  )
}
