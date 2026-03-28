import { randomUUID } from 'crypto'
import { d1Exec, d1Query, isD1Configured } from '@/lib/d1'

export type ProcessingHistoryItem = {
  id: string
  sessionId: string
  sourceFilename: string | null
  mimeType: string | null
  fileSize: number | null
  outputBytes: number | null
  status: 'processing' | 'completed' | 'failed'
  errorMessage: string | null
  creditsCharged: number
  createdAt: string
  updatedAt: string
}

export type ProcessingSummary = {
  totalJobs: number
  completedJobs: number
  failedJobs: number
  creditsUsed: number
}

const PROCESSING_HISTORY_SCHEMA = `
CREATE TABLE IF NOT EXISTS processing_jobs (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  source_filename TEXT,
  mime_type TEXT,
  file_size INTEGER,
  output_bytes INTEGER,
  status TEXT NOT NULL DEFAULT 'processing',
  error_message TEXT,
  credits_charged REAL NOT NULL DEFAULT 0,
  provider TEXT NOT NULL DEFAULT 'remove.bg',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_session_created_at
  ON processing_jobs(session_id, created_at DESC);
`

let schemaPromise: Promise<void> | null = null

function toNumber(value: unknown) {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.length > 0) return Number(value)
  return 0
}

async function ensureProcessingHistorySchema() {
  if (!isD1Configured()) {
    return
  }

  if (!schemaPromise) {
    schemaPromise = d1Exec(PROCESSING_HISTORY_SCHEMA).catch((error) => {
      schemaPromise = null
      throw error
    })
  }

  await schemaPromise
}

export async function createProcessingJob(input: {
  sessionId: string
  sourceFilename?: string | null
  mimeType?: string | null
  fileSize?: number | null
}) {
  if (!isD1Configured()) {
    return null
  }

  await ensureProcessingHistorySchema()

  const jobId = globalThis.crypto.randomUUID()

  await d1Exec(
    `
      INSERT INTO processing_jobs (
        id,
        session_id,
        source_filename,
        mime_type,
        file_size,
        status,
        credits_charged,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, 'processing', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    [
      jobId,
      input.sessionId,
      input.sourceFilename ?? null,
      input.mimeType ?? null,
      input.fileSize ?? null,
    ],
  )

  return jobId
}

export async function markProcessingJobCompleted(jobId: string | null, outputBytes: number) {
  if (!isD1Configured() || !jobId) {
    return
  }

  await ensureProcessingHistorySchema()

  await d1Exec(
    `
      UPDATE processing_jobs
      SET status = 'completed',
          output_bytes = ?,
          credits_charged = 1,
          error_message = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [outputBytes, jobId],
  )
}

export async function markProcessingJobFailed(jobId: string | null, errorMessage: string) {
  if (!isD1Configured() || !jobId) {
    return
  }

  await ensureProcessingHistorySchema()

  await d1Exec(
    `
      UPDATE processing_jobs
      SET status = 'failed',
          error_message = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [errorMessage, jobId],
  )
}

export async function getProcessingHistory(sessionId: string, limit = 8) {
  if (!isD1Configured()) {
    return [] as ProcessingHistoryItem[]
  }

  await ensureProcessingHistorySchema()

  const safeLimit = Math.min(Math.max(limit, 1), 20)
  const result = await d1Query<{
    id: string
    session_id: string
    source_filename: string | null
    mime_type: string | null
    file_size: number | string | null
    output_bytes: number | string | null
    status: 'processing' | 'completed' | 'failed'
    error_message: string | null
    credits_charged: number | string | null
    created_at: string
    updated_at: string
  }>(
    `
      SELECT
        id,
        session_id,
        source_filename,
        mime_type,
        file_size,
        output_bytes,
        status,
        error_message,
        credits_charged,
        created_at,
        updated_at
      FROM processing_jobs
      WHERE session_id = ?
      ORDER BY datetime(created_at) DESC
      LIMIT ${safeLimit}
    `,
    [sessionId],
  )

  return (result.results ?? []).map((row) => ({
    id: row.id,
    sessionId: row.session_id,
    sourceFilename: row.source_filename,
    mimeType: row.mime_type,
    fileSize: row.file_size === null ? null : toNumber(row.file_size),
    outputBytes: row.output_bytes === null ? null : toNumber(row.output_bytes),
    status: row.status,
    errorMessage: row.error_message,
    creditsCharged: toNumber(row.credits_charged),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}

export async function getProcessingSummary(sessionId: string) {
  if (!isD1Configured()) {
    return {
      totalJobs: 0,
      completedJobs: 0,
      failedJobs: 0,
      creditsUsed: 0,
    } satisfies ProcessingSummary
  }

  await ensureProcessingHistorySchema()

  const result = await d1Query<{
    total_jobs: number | string | null
    completed_jobs: number | string | null
    failed_jobs: number | string | null
    credits_used: number | string | null
  }>(
    `
      SELECT
        COUNT(*) AS total_jobs,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_jobs,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed_jobs,
        SUM(CASE WHEN status = 'completed' THEN credits_charged ELSE 0 END) AS credits_used
      FROM processing_jobs
      WHERE session_id = ?
    `,
    [sessionId],
  )

  const summary = result.results?.[0]

  return {
    totalJobs: toNumber(summary?.total_jobs),
    completedJobs: toNumber(summary?.completed_jobs),
    failedJobs: toNumber(summary?.failed_jobs),
    creditsUsed: toNumber(summary?.credits_used),
  } satisfies ProcessingSummary
}
