// Central type definitions for memory system

export type { AgentMemory } from './memory/schema'

export interface MemoryMetadata {
  id: string
  createdAt: string
  project: string
  agent: 'claude'
  version: '1.0'
}

export interface MemoryContext {
  goal: string
  techStack: string[]
  constraints: string[]
}

export interface MemoryState {
  implemented: string[]
  pending: string[]
  filesTouched?: string[]
}

export interface MemoryDecision {
  decision: string
  rationale: string
}
