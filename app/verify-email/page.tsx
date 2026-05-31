export default function VerifyEmail() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 440 }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>📬</div>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Check Your Email</h1>
        <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
          We sent a verification link to your email address.
          Click the link to verify your account and activate your ITS-R Passport.
        </p>
        <div style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>Didn&apos;t receive the email? Check your spam folder or</p>
          <button style={{ color: '#d4af37', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, marginTop: 8 }}>
            Resend verification email
          </button>
        </div>
        <a href="/login" style={{ color: '#64748b', fontSize: 14, textDecoration: 'none' }}>← Back to Sign In</a>
      </div>
    </div>
  )
}
