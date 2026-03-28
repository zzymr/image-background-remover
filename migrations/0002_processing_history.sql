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
