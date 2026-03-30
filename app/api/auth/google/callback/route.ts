import { NextRequest, NextResponse } from 'next/server'
import {
  OAUTH_STATE_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  createUserSession,
  exchangeCodeForGoogleUser,
  getSessionCookieOptions,
  getStateCookieOptions,
  upsertGoogleUser,
} from '@/lib/auth'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

function buildRedirect(request: NextRequest, authError?: string) {
  const url = new URL(authError ? '/login' : '/dashboard', request.url)

  if (authError) {
    url.searchParams.set('authError', authError)
  }

  return url
}

export async function GET(request: NextRequest) {
  const stateCookie = request.cookies.get(OAUTH_STATE_COOKIE_NAME)?.value
  const { searchParams } = new URL(request.url)
  const state = searchParams.get('state')
  const code = searchParams.get('code')
  const oauthError = searchParams.get('error')

  if (oauthError) {
    const response = NextResponse.redirect(buildRedirect(request, oauthError))
    response.cookies.set({
      name: OAUTH_STATE_COOKIE_NAME,
      value: '',
      ...getStateCookieOptions(request),
      maxAge: 0,
    })
    return response
  }

  if (!state || !stateCookie || state !== stateCookie) {
    const response = NextResponse.redirect(buildRedirect(request, 'state_mismatch'))
    response.cookies.set({
      name: OAUTH_STATE_COOKIE_NAME,
      value: '',
      ...getStateCookieOptions(request),
      maxAge: 0,
    })
    return response
  }

  if (!code) {
    const response = NextResponse.redirect(buildRedirect(request, 'missing_code'))
    response.cookies.set({
      name: OAUTH_STATE_COOKIE_NAME,
      value: '',
      ...getStateCookieOptions(request),
      maxAge: 0,
    })
    return response
  }

  try {
    const profile = await exchangeCodeForGoogleUser(request, code)
    const user = await upsertGoogleUser(profile)
    const session = await createUserSession(user.id, request)

    const response = NextResponse.redirect(buildRedirect(request))

    response.cookies.set({
      name: OAUTH_STATE_COOKIE_NAME,
      value: '',
      ...getStateCookieOptions(request),
      maxAge: 0,
    })

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: session.cookieValue,
      ...getSessionCookieOptions(request, session.maxAge),
      expires: new Date(session.expiresAt * 1000),
    })

    return response
  } catch (error) {
    console.error('Failed to complete Google login:', error)

    const response = NextResponse.redirect(buildRedirect(request, 'login_failed'))
    response.cookies.set({
      name: OAUTH_STATE_COOKIE_NAME,
      value: '',
      ...getStateCookieOptions(request),
      maxAge: 0,
    })
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: '',
      ...getSessionCookieOptions(request, 0),
      maxAge: 0,
    })

    return response
  }
}
