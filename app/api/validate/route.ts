import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token') || req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ valid: false, error: 'No token' }, { status: 401 })

    const payload = await verifyToken(token)
    if (!payload || !payload.userId) return NextResponse.json({ valid: false, error: 'Invalid token' }, { status: 401 })

    const { data: user } = await supabaseAdmin
      .from('its_r_users')
      .select('id, passport_id, full_name, email, avatar_url, email_verified')
      .eq('id', payload.userId as string)
      .single()

    if (!user) return NextResponse.json({ valid: false, error: 'User not found' }, { status: 401 })

    return NextResponse.json({ valid: true, user: { id: user.id, passport_id: user.passport_id, name: user.full_name, email: user.email, avatar_url: user.avatar_url, email_verified: user.email_verified } })
  } catch {
    return NextResponse.json({ valid: false, error: 'Internal error' }, { status: 500 })
  }
}
