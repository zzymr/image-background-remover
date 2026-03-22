import { NextRequest, NextResponse } from 'next/server';

import {
  SESSION_COOKIE_NAME,
  deleteSession,
  getSessionCookieOptions,
} from '@/lib/auth';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await deleteSession(request);
  } catch (error) {
    console.error('Failed to delete session:', error);
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    ...getSessionCookieOptions(request, 0),
    maxAge: 0,
  });

  return response;
}
