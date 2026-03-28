import { NextRequest, NextResponse } from 'next/server'
import { getProcessingHistory, getProcessingSummary } from '@/lib/processing-history'
import { isD1Configured } from '@/lib/d1'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId =
      searchParams.get('sessionId') || request.headers.get('x-client-session-id') || undefined

    if (!sessionId) {
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

    const [items, summary] = await Promise.all([
      getProcessingHistory(sessionId),
      getProcessingSummary(sessionId),
    ])

    return NextResponse.json({
      configured: true,
      items,
      summary,
    })
  } catch (error) {
    console.error('Error fetching processing history:', error)
    return NextResponse.json(
      { error: 'Failed to load processing history.' },
      { status: 500 },
    )
  }
}
