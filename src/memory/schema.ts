import { z } from 'zod'

export const CURRENT_VERSION = '1.0'

// Schema for version 1.0
export const AgentMemorySchemaV1 = z.object({
  meta: z.object({
    id: z.string().uuid(),
    createdAt: z.string().datetime(),
    project: z.string().min(1),
    agent: z.literal('claude'),
    version: z.literal('1.0')
  }),

  context: z.object({
    goal: z.string().min(1).max(500),
    techStack: z.array(z.string().min(1)),
    constraints: z.array(z.string().min(1))
  }),

  state: z.object({
    implemented: z.array(z.string().min(1)),
    pending: z.array(z.string().min(1)),
    filesTouched: z.array(z.string().min(1)).optional()
  }),

  decisions: z.array(
    z.object({
      decision: z.string().min(1),
      rationale: z.string().min(1)
    })
  ),

  nextActions: z.array(z.string().min(1)),

  raw: z
    .object({
      source: z.literal('conversation'),
      excerpt: z.string().optional()
    })
    .optional()
})

// Union of all schema versions (for future-proofing)
export const AgentMemorySchema = z.union([
  AgentMemorySchemaV1
  // Future versions would be added here: AgentMemorySchemaV2, etc.
])

export type AgentMemory = z.infer<typeof AgentMemorySchemaV1>
