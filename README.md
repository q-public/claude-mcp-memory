# Claude Memory Plugin 💾

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](https://github.com/q-public/claude-mcp-memory)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)

Persistent memory layer for Claude Code - save conversation context and resume work across sessions.

## Overview

This Claude Code plugin provides three slash commands to help you save and resume work:

- `/memory summarize` - Structure current conversation into memory format
- `/memory save` - Persist memory snapshot (JSON + Markdown)
- `/memory load` - Resume from previous memory snapshot

Memory snapshots are stored as both machine-readable JSON and human-readable Markdown, making them portable, version-controllable, and inspectable.

## Installation

### Quick Install (Recommended)

```bash
# Add the marketplace
/plugin marketplace add q-public/claude-mcp-memory

# Install the plugin
/plugin install claude-memory@justq-marketplace
```

### Manual Installation

1. Clone this repository into your plugins directory:
   ```bash
   cd ~/.claude/plugins  # or your preferred plugins location
   git clone https://github.com/q-public/claude-mcp-memory.git
   cd claude-mcp-memory
   ```

2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

3. Restart Claude Code and the plugin will be available!

See [INSTALL.md](INSTALL.md) for detailed installation instructions.

## Usage

### Step 1: End Your Session

When you're done working on something, use `/memory summarize`:

```
You: /memory summarize
```

Claude will structure the conversation into a JSON format with:
- **Context**: Goal, tech stack, constraints
- **State**: What's done, what's pending, files touched
- **Decisions**: Key architectural choices made
- **Next Actions**: Suggested tasks to continue work

### Step 2: Save the Memory

Copy the JSON output and use `/memory save`:

```
You: /memory save <paste-json-here>
```

This creates two files in the `memory/` directory:
- `{uuid}.json` - Machine-readable structured data
- `{uuid}.md` - Human-readable summary

### Step 3: Resume Later

In a new Claude Code session, use `/memory load`:

```
You: /memory load                    # Loads latest memory
You: /memory load --id=<uuid>        # Loads specific memory
You: /memory load --list             # Shows all available memories
```

Claude will inject the memory into context and continue from where you left off.

## Example Workflow

```bash
# Working on a feature
You: Help me implement user authentication

# ... work happens ...

# End of session
You: /memory summarize
Claude: <outputs structured JSON>

You: /memory save {"project":"my-app",...}
Claude: ✅ Memory saved! ID: abc-123-def

# Next day, new session
You: /memory load
Claude: 📋 Memory loaded from yesterday
        Resuming work on user authentication...
```

## Memory Structure

Each memory snapshot contains:

```json
{
  "meta": {
    "id": "uuid-v4",
    "createdAt": "ISO-8601-timestamp",
    "project": "project-name",
    "agent": "claude",
    "version": "1.0"
  },
  "context": {
    "goal": "What we're trying to achieve",
    "techStack": ["typescript", "react", "..."],
    "constraints": ["use existing API", "..."]
  },
  "state": {
    "implemented": ["feature 1", "feature 2"],
    "pending": ["feature 3", "bug fix"],
    "filesTouched": ["src/auth.ts", "..."]
  },
  "decisions": [
    {
      "decision": "Use JWT for auth",
      "rationale": "Stateless, works with API gateway"
    }
  ],
  "nextActions": ["Write tests", "Deploy to staging"]
}
```

## Philosophy

Claude is stateless - each session starts fresh. This plugin makes memory **explicit**, **versioned**, and **portable**:

- ✅ **Explicit**: You control what gets saved and when
- ✅ **Versioned**: Memories are plain text files (git-friendly)
- ✅ **Portable**: JSON + Markdown format, no proprietary lock-in
- ✅ **Inspectable**: Human-readable Markdown for quick review

## Development

```bash
# Build
npm run build

# Clean
npm run clean

# Test scripts directly
node scripts/save-memory.js '{"project":"test",...}'
node scripts/load-memory.js --list
```

## Architecture

See [CLAUDE.md](./CLAUDE.md) for detailed architecture and implementation notes.

## License

ISC
