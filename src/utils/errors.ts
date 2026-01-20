import { ZodError } from 'zod'

export class MemoryError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'MemoryError'
  }
}

export function formatZodError(error: ZodError): string {
  return error.issues
    .map((e: any) => `${e.path.join('.')}: ${e.message}`)
    .join('; ')
}

export function formatError(error: unknown): string {
  if (error instanceof MemoryError) {
    return `[${error.code}] ${error.message}`
  }

  if (error instanceof ZodError) {
    return `Validation failed: ${formatZodError(error)}`
  }

  if (error instanceof Error) {
    return `Error: ${error.message}`
  }

  return 'An unexpected error occurred'
}
