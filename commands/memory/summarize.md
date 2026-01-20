---
description: Summarize conversation into structured memory format
allowed-tools: Read
---

# Summarize Current Session Into Memory

Please analyze the current Claude Code conversation and create a structured memory snapshot using the following format:

## Required Structure

```json
{
  "project": "<project-name>",
  "context": {
    "goal": "<concise 1-2 sentence description of overall objective>",
    "techStack": ["<technology-1>", "<technology-2>", "..."],
    "constraints": ["<constraint-1>", "<constraint-2>", "..."]
  },
  "state": {
    "implemented": ["<completed-item-1>", "<completed-item-2>", "..."],
    "pending": ["<pending-item-1>", "<pending-item-2>", "..."],
    "filesTouched": ["<file-path-1>", "<file-path-2>", "..."]
  },
  "decisions": [
    {
      "decision": "<decision-made>",
      "rationale": "<why-this-was-chosen>"
    }
  ],
  "nextActions": ["<action-1>", "<action-2>", "..."]
}
```

## Guidelines

- **Be concise** - focus on facts, not prose
- **goal**: What problem are we solving? What feature are we building?
- **techStack**: Only list actually-used technologies (languages, frameworks, libraries)
- **constraints**: Technical limitations, requirements, or guidelines followed
- **implemented**: Completed tasks/features in this session
- **pending**: Started but incomplete work
- **filesTouched**: Files created or modified (optional if too many)
- **decisions**: Important architectural or technical choices made
- **nextActions**: Concrete next steps for resuming work

## Output

Provide ONLY the JSON object - no additional text or explanation.

After you provide the JSON, I'll use `/memory save` to persist it.
