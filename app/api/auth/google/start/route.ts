import { NextRequest, NextResponse } from 'next/server';

import {
  OAUTH_STATE_COOKIE_NAME,
  createStateCookieValue,
  getGoogleAuthorizationUrl,
  getStateCookieOptions,
} from '@/lib/auth';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const state = createStateCookieValue();
    const response = NextResponse.redirect(getGoogleAuthorizationUrl(request, state));

    response.cookies.set({
      name: OAUTH_STATE_COOKIE_NAME,
      value: state,
      ...getStateCookieOptions(request),
    });

    return response;
  } catch (error) {
    console.error('Failed to start Google login:', error);
    const fallbackUrl = new URL('/', request.url);
    fallbackUrl.searchParams.set('authError', 'auth_unavailable');
    return NextResponse.redirect(fallbackUrl);
  }
}
