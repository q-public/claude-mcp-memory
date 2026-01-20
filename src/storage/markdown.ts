import type { AgentMemory } from '../memory/schema'

export function generateMarkdown(memory: AgentMemory): string {
  const sections: string[] = []

  // Header
  sections.push(`# Agent Memory – ${memory.meta.id}`)
  sections.push('')
  sections.push(`**Created:** ${new Date(memory.meta.createdAt).toLocaleString()}`)
  sections.push(`**Project:** ${memory.meta.project}`)
  sections.push(`**Version:** ${memory.meta.version}`)
  sections.push('')

  // Goal
  sections.push('## Goal')
  sections.push(memory.context.goal)
  sections.push('')

  // Tech Stack
  if (memory.context.techStack.length > 0) {
    sections.push('## Tech Stack')
    memory.context.techStack.forEach(tech => {
      sections.push(`- ${tech}`)
    })
    sections.push('')
  }

  // Constraints
  if (memory.context.constraints.length > 0) {
    sections.push('## Constraints')
    memory.context.constraints.forEach(constraint => {
      sections.push(`- ${constraint}`)
    })
    sections.push('')
  }

  // Implemented
  if (memory.state.implemented.length > 0) {
    sections.push('## ✅ Implemented')
    memory.state.implemented.forEach(item => {
      sections.push(`- ${item}`)
    })
    sections.push('')
  }

  // Pending
  if (memory.state.pending.length > 0) {
    sections.push('## ⏳ Pending')
    memory.state.pending.forEach(item => {
      sections.push(`- ${item}`)
    })
    sections.push('')
  }

  // Files Touched
  if (memory.state.filesTouched && memory.state.filesTouched.length > 0) {
    sections.push('## 📁 Files Modified')
    memory.state.filesTouched.forEach(file => {
      sections.push(`- ${file}`)
    })
    sections.push('')
  }

  // Decisions
  if (memory.decisions.length > 0) {
    sections.push('## 🔀 Key Decisions')
    memory.decisions.forEach((d, i) => {
      sections.push(`${i + 1}. **${d.decision}**`)
      sections.push(`   - Rationale: ${d.rationale}`)
    })
    sections.push('')
  }

  // Next Actions
  if (memory.nextActions.length > 0) {
    sections.push('## 🎯 Next Actions')
    memory.nextActions.forEach(action => {
      sections.push(`- [ ] ${action}`)
    })
    sections.push('')
  }

  return sections.join('\n')
}
