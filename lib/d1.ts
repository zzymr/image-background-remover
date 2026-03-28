type D1Param = string | number | boolean | null

type D1Request =
  | {
      sql: string
      params?: D1Param[]
    }
  | {
      batch: Array<{
        sql: string
        params?: D1Param[]
      }>
    }

type D1ResponseMeta = {
  changed_db?: boolean
  changes?: number
  duration?: number
  last_row_id?: number
  rows_read?: number
  rows_written?: number
  served_by_colo?: string
  served_by_primary?: boolean
  served_by_region?: string
  size_after?: number
  timings?: {
    sql_duration_ms?: number
  }
}

export type D1QueryResult<T = Record<string, unknown>> = {
  success?: boolean
  results?: T[]
  meta?: D1ResponseMeta
}

type D1ApiResponse<T> = {
  success: boolean
  errors?: Array<{ message?: string }>
  result?: Array<D1QueryResult<T>>
}

type D1Config = {
  accountId: string
  databaseId: string
  apiToken: string
}

function getD1Config(): D1Config | null {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID
  const apiToken = process.env.CLOUDFLARE_API_TOKEN

  if (!accountId || !databaseId || !apiToken) {
    return null
  }

  return {
    accountId,
    databaseId,
    apiToken,
  }
}

export function isD1Configured() {
  return Boolean(getD1Config())
}

async function requestD1<T = Record<string, unknown>>(body: D1Request) {
  const config = getD1Config()

  if (!config) {
    throw new Error(
      'Cloudflare D1 is not configured. Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, and CLOUDFLARE_API_TOKEN.',
    )
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${config.databaseId}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    },
  )

  const payload = (await response.json()) as D1ApiResponse<T>

  if (!response.ok || !payload.success || payload.errors?.length) {
    const message = payload.errors?.map((error) => error.message).filter(Boolean).join('; ')
    throw new Error(message || 'Cloudflare D1 query failed.')
  }

  return payload.result ?? []
}

export async function d1Query<T = Record<string, unknown>>(sql: string, params: D1Param[] = []) {
  const [result] = await requestD1<T>({ sql, params })
  return result ?? { success: true, results: [] }
}

export async function d1Exec(sql: string, params: D1Param[] = []) {
  await requestD1({ sql, params })
}

export async function d1Batch(batch: Array<{ sql: string; params?: D1Param[] }>) {
  return requestD1({ batch })
}
