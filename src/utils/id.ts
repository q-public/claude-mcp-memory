import { v4 as uuid, validate as validateUuid } from 'uuid'

export function generateId(): string {
  return uuid()
}

export function isValidId(id: string): boolean {
  // Accept UUID format or "latest"
  if (id === 'latest') return true
  return validateUuid(id)
}

export function sanitizeId(id: string): string {
  // Prevent path traversal
  if (id === 'latest') return id

  if (!validateUuid(id)) {
    throw new Error(`Invalid memory ID: ${id}`)
  }

  return id
}
