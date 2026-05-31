import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'
import { generatePassportId, signToken, setSessionCookie } from '@/lib/auth'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { full_name, email, password } = await req.json()
    if (!full_name || !email || !password) return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: 'Password min 8 chars' }, { status: 400 })

    const { data: existing } = await supabaseAdmin.from('its_r_users').select('id').eq('email', email.toLowerCase()).single()
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

    const password_hash = await bcrypt.hash(password, 12)
    const passport_id = generatePassportId()

    const { data: user, error } = await supabaseAdmin.from('its_r_users').insert({
      full_name, email: email.toLowerCase(), password_hash, passport_id, email_verified: false
    }).select().single()
    if (error || !user) return NextResponse.json({ error: 'Registration failed' }, { status: 500 })

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const code_hash = await bcrypt.hash(code, 10)
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    await supabaseAdmin.from('its_r_verification_codes').insert({ user_id: user.id, code_hash, type: 'email_verify', expires_at, used: false })

    try {
      await resend.emails.send({
        from: 'ITS-R Passport <noreply@its-r-passport.vercel.app>',
        to: email,
        subject: 'Verify your ITS-R Passport',
        html: `<div style="font-family:sans-serif;background:#0a0a0f;color:#e2e8f0;padding:40px;border-radius:12px;max-width:480px;margin:0 auto">
          <h1 style="color:#d4af37;font-size:28px;margin-bottom:8px">ITS-R Passport</h1>
          <p style="color:#94a3b8;margin-bottom:24px">Welcome ${full_name}! Your Passport ID: <strong style="color:#d4af37;font-family:monospace;letter-spacing:2px">${passport_id}</strong></p>
          <p style="color:#94a3b8;margin-bottom:24px">Your verification code:</p>
          <div style="background:#0d1117;border:1px solid #1e293b;border-radius:8px;padding:24px;text-align:center;margin-bottom:24px">
            <span style="color:#d4af37;font-size:36px;font-family:monospace;letter-spacing:8px;font-weight:700">${code}</span>
          </div>
          <p style="color:#64748b;font-size:14px">This code expires in 24 hours.</p>
          <hr style="border-color:#1e293b;margin:24px 0"/>
          <p style="color:#334155;font-size:12px">ITS-R Universe — In loving memory of Roshan Ali Sahab</p>
        </div>`
      })
    } catch { /* email failed — user can resend */ }

    const token = await signToken({ userId: user.id, email: user.email, passportId: passport_id })
    setSessionCookie(token)

    return NextResponse.json({ success: true, passport_id, message: 'Passport created. Check email to verify.' })
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
