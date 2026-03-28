import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const baseDir = '.vercel/output/static/_worker.js/__next-on-pages-dist__/functions'

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      walk(fullPath)
      continue
    }

    if (!entry.isFile() || !fullPath.endsWith('.func.js')) {
      continue
    }

    const original = readFileSync(fullPath, 'utf8')
    const patched = original
      .replaceAll('from"async_hooks"', 'from"node:async_hooks"')
      .replaceAll("from'async_hooks'", "from'node:async_hooks'")

    if (patched !== original) {
      writeFileSync(fullPath, patched)
      console.log(`patched: ${fullPath}`)
    }
  }
}

if (!statSync(baseDir, { throwIfNoEntry: false })) {
  console.error(`functions output not found: ${baseDir}`)
  process.exit(1)
}

walk(baseDir)
console.log('next-on-pages async_hooks patch complete')
