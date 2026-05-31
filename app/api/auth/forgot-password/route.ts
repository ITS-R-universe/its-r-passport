import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const { data: user } = await supabaseAdmin.from('its_r_users').select('id, full_name, passport_id').eq('email', email.toLowerCase()).single()
    if (!user) return NextResponse.json({ success: true }) // Don't reveal if email exists

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const code_hash = await bcrypt.hash(code, 10)
    const expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString()

    await supabaseAdmin.from('its_r_verification_codes').insert({ user_id: user.id, code_hash, type: 'password_reset', expires_at, used: false })

    try {
      await resend.emails.send({
        from: 'ITS-R Passport <noreply@its-r-passport.vercel.app>',
        to: email,
        subject: 'Reset your ITS-R Passport password',
        html: `<div style="font-family:sans-serif;background:#0a0a0f;color:#e2e8f0;padding:40px;border-radius:12px;max-width:480px;margin:0 auto">
          <h1 style="color:#d4af37">Password Reset</h1>
          <p style="color:#94a3b8">Hi ${user.full_name}, your reset code:</p>
          <div style="background:#0d1117;border:1px solid #1e293b;border-radius:8px;padding:24px;text-align:center;margin:24px 0">
            <span style="color:#d4af37;font-size:36px;font-family:monospace;letter-spacing:8px;font-weight:700">${code}</span>
          </div>
          <p style="color:#64748b;font-size:14px">Expires in 15 minutes.</p>
          <hr style="border-color:#1e293b;margin:24px 0"/>
          <p style="color:#334155;font-size:12px">ITS-R Universe — In loving memory of Roshan Ali Sahab</p>
        </div>`
      })
    } catch { /* silent */ }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
