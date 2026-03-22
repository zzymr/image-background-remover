import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser, isAuthConfigured } from '@/lib/auth';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const configured = isAuthConfigured();
    const user = configured ? await getCurrentUser(request) : null;

    return NextResponse.json(
      {
        configured,
        authenticated: Boolean(user),
        user,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Failed to read auth session:', error);

    return NextResponse.json(
      {
        configured: false,
        authenticated: false,
        user: null,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}
