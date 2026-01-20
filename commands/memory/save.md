---
description: Save memory snapshot to disk (JSON + Markdown)
allowed-tools: Bash(node:*)
argument-hint: <paste-json-from-summarize>
---

# Save Memory Snapshot

Paste the JSON output from `/memory summarize` below (everything after this line):

---

!`node scripts/save-memory.js "$ARGUMENTS"`

Your memory has been saved. Use `/memory load` to resume from this snapshot in a future session.
