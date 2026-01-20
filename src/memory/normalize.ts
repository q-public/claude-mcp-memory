import { AgentMemorySchemaV1, CURRENT_VERSION, type AgentMemory } from './schema'
import { generateId } from '../utils/id'
import { MemoryError } from '../utils/errors'

export function normalizeMemory(input: unknown): AgentMemory {
  // Reject if input contains 'meta' field (prevent overwriting)
  if (input && typeof input === 'object' && 'meta' in input) {
    throw new MemoryError(
      'Input should not contain "meta" field - it will be generated automatically',
      'INVALID_INPUT_META'
    )
  }

  // Extract project name if provided
  const inputObj = input as Record<string, unknown>
  const projectName = typeof inputObj.project === 'string'
    ? inputObj.project
    : 'unknown'

  // Build memory with generated meta
  const memory = {
    meta: {
      id: generateId(),
      createdAt: new Date().toISOString(),
      project: projectName,
      agent: 'claude' as const,
      version: CURRENT_VERSION as '1.0'
    },
    context: inputObj.context,
    state: inputObj.state,
    decisions: inputObj.decisions,
    nextActions: inputObj.nextActions,
    raw: inputObj.raw
  }

  // Validate and return
  return AgentMemorySchemaV1.parse(memory)
}
