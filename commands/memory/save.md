---
description: Save memory snapshot to disk (JSON + Markdown)
allowed-tools: Bash(echo:*), Bash(node:*)
argument-hint: <json-from-summarize>
---

# Save Memory Snapshot

I'll save the provided JSON to a memory snapshot.

!`echo '$ARGUMENTS' | node scripts/save-memory-stdin.js`

Your memory snapshot has been saved! Use `/memory load` to resume from this snapshot in a future session.
