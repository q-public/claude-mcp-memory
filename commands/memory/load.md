---
description: Load previous memory snapshot into context
allowed-tools: Bash(node:*)
argument-hint: [--id=<memory-id>] or leave empty for latest
---

# Resume From Memory

!`node scripts/load-memory.js $ARGUMENTS`

## Instructions for Resuming

You are resuming from a previous Claude Code session. The memory snapshot above contains:

- **Context**: The original goal, tech stack, and constraints
- **State**: What was completed and what's still pending
- **Decisions**: Architectural choices already made
- **Next Actions**: Suggested tasks to continue work

## Rules

1. **Treat the memory as source of truth** - Don't second-guess past decisions unless user asks
2. **Start with nextActions** - Continue from where the previous session left off
3. **Respect constraints** - Follow the technical constraints listed
4. **Ask before major changes** - If modifying files not in filesTouched, confirm with user first
5. **Reference decisions** - When making related choices, be consistent with past decisions

## Getting Started

Review the memory above, then either:
- Continue with the suggested next actions
- Ask the user what they'd like to work on
- Let the user provide new instructions
