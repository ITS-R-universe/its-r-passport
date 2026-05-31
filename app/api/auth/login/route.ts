import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'
import { signToken, setSessionCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })

    const { data: user } = await supabaseAdmin
      .from('its_r_users')
      .select('id, passport_id, full_name, email, password_hash, email_verified, avatar_url')
      .eq('email', email.toLowerCase())
      .single()

    if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      await supabaseAdmin.from('its_r_login_history').insert({ user_id: user.id, ip_address: req.headers.get('x-forwarded-for') || 'unknown', user_agent: req.headers.get('user-agent') || '', success: false })
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    await supabaseAdmin.from('its_r_login_history').insert({ user_id: user.id, ip_address: req.headers.get('x-forwarded-for') || 'unknown', user_agent: req.headers.get('user-agent') || '', success: true })

    const token = await signToken({ userId: user.id, email: user.email, passportId: user.passport_id })
    setSessionCookie(token)

    return NextResponse.json({ success: true, user: { id: user.id, passport_id: user.passport_id, full_name: user.full_name, email: user.email, email_verified: user.email_verified, avatar_url: user.avatar_url } })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
