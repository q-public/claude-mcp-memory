import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import { AgentMemorySchemaV1, type AgentMemory } from '../memory/schema'
import { sanitizeId } from '../utils/id'
import { MemoryError } from '../utils/errors'
import { generateMarkdown } from './markdown'

const MEMORY_DIR = path.resolve(process.cwd(), 'memory')

async function ensureDir(): Promise<void> {
  try {
    await fs.mkdir(MEMORY_DIR, { recursive: true })
  } catch (error) {
    throw new MemoryError(
      `Failed to create memory directory: ${MEMORY_DIR}`,
      'DIR_CREATE_FAILED',
      error
    )
  }
}

/**
 * Atomic write: write to temp file, then rename
 * This prevents partial writes if process crashes
 */
async function writeAtomic(filePath: string, content: string): Promise<void> {
  const tempPath = `${filePath}.tmp`

  try {
    await fs.writeFile(tempPath, content, 'utf-8')
    await fs.rename(tempPath, filePath)
  } catch (error) {
    // Clean up temp file if it exists
    try {
      await fs.unlink(tempPath)
    } catch {
      // Ignore cleanup errors
    }
    throw error
  }
}

export async function saveMemoryToFs(memory: AgentMemory): Promise<void> {
  await ensureDir()

  // Sanitize ID to prevent path traversal
  const safeId = sanitizeId(memory.meta.id)

  const jsonPath = path.join(MEMORY_DIR, `${safeId}.json`)
  const mdPath = path.join(MEMORY_DIR, `${safeId}.md`)

  try {
    // Generate content
    const jsonContent = JSON.stringify(memory, null, 2)
    const mdContent = generateMarkdown(memory)

    // Atomic writes for both files
    await Promise.all([
      writeAtomic(jsonPath, jsonContent),
      writeAtomic(mdPath, mdContent)
    ])
  } catch (error) {
    throw new MemoryError(
      `Failed to save memory: ${memory.meta.id}`,
      'SAVE_FAILED',
      error
    )
  }
}

export async function loadMemoryFromFs(id: string): Promise<AgentMemory> {
  await ensureDir()

  try {
    let filePath: string

    if (id === 'latest') {
      filePath = await findLatestMemory()
    } else {
      // Sanitize ID to prevent path traversal
      const safeId = sanitizeId(id)
      filePath = path.join(MEMORY_DIR, `${safeId}.json`)
    }

    // Read and parse JSON
    const content = await fs.readFile(filePath, 'utf-8')
    const raw = JSON.parse(content)

    // IMPORTANT: Validate loaded data to prevent corrupted/malicious input
    const validated = AgentMemorySchemaV1.parse(raw)

    return validated
  } catch (error) {
    if (error instanceof MemoryError) {
      throw error
    }

    throw new MemoryError(
      `Failed to load memory: ${id}`,
      'LOAD_FAILED',
      error
    )
  }
}

/**
 * Find the latest memory file by modification time (mtime)
 * This fixes the bug where UUID sorting was used instead of timestamps
 */
async function findLatestMemory(): Promise<string> {
  const files = await fs.readdir(MEMORY_DIR)
  const jsonFiles = files.filter(f => f.endsWith('.json'))

  if (jsonFiles.length === 0) {
    throw new MemoryError(
      'No memory files found',
      'NO_MEMORIES'
    )
  }

  // Get stats for all files
  const filesWithStats = await Promise.all(
    jsonFiles.map(async file => {
      const fullPath = path.join(MEMORY_DIR, file)
      const stats = await fs.stat(fullPath)
      return { path: fullPath, mtime: stats.mtime }
    })
  )

  // Sort by modification time descending (newest first)
  filesWithStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime())

  return filesWithStats[0].path
}

/**
 * Regenerate markdown from JSON (recovery utility)
 */
export async function regenerateMarkdown(id: string): Promise<void> {
  const memory = await loadMemoryFromFs(id)
  const safeId = sanitizeId(memory.meta.id)
  const mdPath = path.join(MEMORY_DIR, `${safeId}.md`)
  const mdContent = generateMarkdown(memory)

  await writeAtomic(mdPath, mdContent)
}

/**
 * List all available memories
 */
export async function listMemories(): Promise<Array<{ id: string; createdAt: Date; project: string }>> {
  await ensureDir()

  const files = await fs.readdir(MEMORY_DIR)
  const jsonFiles = files.filter(f => f.endsWith('.json'))

  const memories = await Promise.all(
    jsonFiles.map(async file => {
      try {
        const fullPath = path.join(MEMORY_DIR, file)
        const content = await fs.readFile(fullPath, 'utf-8')
        const data = JSON.parse(content)

        return {
          id: data.meta?.id || file.replace('.json', ''),
          createdAt: new Date(data.meta?.createdAt || 0),
          project: data.meta?.project || 'unknown'
        }
      } catch {
        return null
      }
    })
  )

  return memories
    .filter((m): m is NonNullable<typeof m> => m !== null)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}
