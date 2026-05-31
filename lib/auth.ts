import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { supabaseAdmin } from './supabase'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
const COOKIE = 'its_r_session'

export function generatePassportId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const seg = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `ITSR-${seg(4)}-${seg(4)}`
}

export async function signToken(payload: Record<string, unknown>, expiresIn = '24h'): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as Record<string, unknown>
  } catch {
    return null
  }
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  })
}

export function clearSessionCookie() {
  cookies().set(COOKIE, '', { maxAge: 0, path: '/' })
}

export function getSessionCookie(): string | undefined {
  return cookies().get(COOKIE)?.value
}

export async function getCurrentUser() {
  const token = getSessionCookie()
  if (!token) return null
  const payload = await verifyToken(token)
  if (!payload || !payload.userId) return null

  const { data } = await supabaseAdmin
    .from('its_r_users')
    .select('id, passport_id, full_name, email, email_verified, avatar_url, created_at')
    .eq('id', payload.userId as string)
    .single()

  return data
}
