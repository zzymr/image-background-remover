import { NextRequest, NextResponse } from 'next/server'
import { getProcessingHistory, getProcessingSummary } from '@/lib/processing-history'
import { isD1Configured } from '@/lib/d1'
import { getCurrentUser, isAuthConfigured } from '@/lib/auth'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId =
      searchParams.get('sessionId') || request.headers.get('x-client-session-id') || undefined

    const authEnabled = isAuthConfigured()
    const user = authEnabled ? await getCurrentUser(request) : null

    if (authEnabled && !user) {
      return NextResponse.json({ error: 'Please sign in to view your history.' }, { status: 401 })
    }

    if (!sessionId && !user?.id) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    if (!isD1Configured()) {
      return NextResponse.json({
        configured: false,
        items: [],
        summary: {
          totalJobs: 0,
          completedJobs: 0,
          failedJobs: 0,
          creditsUsed: 0,
        },
      })
    }

    const scope = {
      sessionId,
      userId: user?.id,
    }

    const [items, summary] = await Promise.all([
      getProcessingHistory(scope),
      getProcessingSummary(scope),
    ])

    return NextResponse.json({
      configured: true,
      items,
      summary,
    })
  } catch (error) {
    console.error('Error fetching processing history:', error)
    return NextResponse.json({ error: 'Failed to load processing history.' }, { status: 500 })
  }
}
