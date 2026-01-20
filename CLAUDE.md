# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Claude Code plugin that provides persistent memory capabilities. It enables Claude to save conversation context and resume work across sessions by creating structured memory snapshots that are both machine-readable (JSON) and human-readable (Markdown).

**Architecture**: Plugin with markdown-based slash commands + TypeScript scripts

## Build and Development Commands

```bash
# Build TypeScript to JavaScript
npm run build

# Clean build artifacts
npm run clean

# Test scripts directly
node scripts/save-memory.js '{"project":"test",...}'
node scripts/load-memory.js --list
```

## Plugin Structure

```
.claude-plugin/
  plugin.json              # Plugin manifest

commands/memory/
  summarize.md             # /memory summarize command
  save.md                  # /memory save command
  load.md                  # /memory load command

scripts/
  save-memory.js           # Node.js script called by save command
  load-memory.js           # Node.js script called by load command

src/
  memory/
    schema.ts              # Zod schema definitions (v1.0 + versioning support)
    normalize.ts           # Input validation and normalization
  storage/
    fs.ts                  # Filesystem operations (async, atomic writes)
    markdown.ts            # Markdown generation from memory objects
  utils/
    id.ts                  # UUID generation and validation
    errors.ts              # Custom error types and formatting
  types.ts                 # Central type definitions
```

## Command Flow

### `/memory summarize`

**File**: `commands/memory/summarize.md`

- **Purpose**: Prompts Claude to structure current conversation
- **Output**: Displays JSON template and instructions
- **No code execution** - pure prompt engineering

### `/memory save`

**Files**: `commands/memory/save.md` → `scripts/save-memory.js`

**Flow**:
1. User pastes JSON output from summarize
2. Markdown command executes: `node scripts/save-memory.js "$ARGUMENTS"`
3. Script performs:
   - Parse JSON input
   - Normalize via `normalizeMemory()` - adds UUID, timestamp, validates
   - Save via `saveMemoryToFs()` - atomic writes to JSON + Markdown
4. Returns success message with memory ID

**Bug Fixes Applied**:
- ✅ Rejects input containing `meta` field (prevents overwrite confusion)
- ✅ Uses atomic writes (temp file → rename) to prevent corruption
- ✅ Async I/O (`fs/promises`) instead of blocking sync calls
- ✅ Path traversal protection via `sanitizeId()`
- ✅ Comprehensive error handling with clear messages

### `/memory load`

**Files**: `commands/memory/load.md` → `scripts/load-memory.js`

**Flow**:
1. User specifies `--id=<uuid>` or omits for latest
2. Markdown command executes: `node scripts/load-memory.js $ARGUMENTS`
3. Script performs:
   - Load via `loadMemoryFromFs(id)`
   - **CRITICAL**: Validates loaded data against schema (security)
   - Format and display memory with resume instructions
4. Returns formatted memory for Claude to read

**Bug Fixes Applied**:
- ✅ "Latest" resolution now uses file `mtime` (modification time) instead of broken UUID sort
- ✅ Validates loaded data to prevent injection of corrupted/malicious data
- ✅ Path traversal protection
- ✅ Better error messages with troubleshooting tips

## Memory Schema

**File**: `src/memory/schema.ts`

**Current Version**: 1.0

**Structure**:
```typescript
{
  meta: {
    id: string (UUID v4),
    createdAt: string (ISO 8601),
    project: string (min 1 char),
    agent: "claude",
    version: "1.0"
  },
  context: {
    goal: string (1-500 chars),
    techStack: string[] (each min 1 char),
    constraints: string[] (each min 1 char)
  },
  state: {
    implemented: string[],
    pending: string[],
    filesTouched?: string[]  // optional
  },
  decisions: Array<{
    decision: string,
    rationale: string
  }>,
  nextActions: string[]
}
```

**Validation**: Uses Zod v4 with:
- UUID validation for `meta.id`
- Datetime validation for `meta.createdAt`
- Min length constraints on all strings
- Version union for future schema evolution

## Storage Layer

**File**: `src/storage/fs.ts`

**Directory**: `memory/` (created automatically at project root)

**File Naming**: `{uuid}.json` and `{uuid}.md`

**Key Functions**:

1. **saveMemoryToFs(memory)**:
   - Atomic write pattern (write to .tmp, rename)
   - Parallel writes for JSON and Markdown
   - Sanitizes IDs to prevent path traversal

2. **loadMemoryFromFs(id)**:
   - Resolves "latest" using file mtime (not UUID sort!)
   - Validates loaded JSON against schema
   - Throws `MemoryError` with clear codes on failure

3. **listMemories()**:
   - Returns all memories sorted by creation time
   - Includes metadata preview (id, project, timestamp)

4. **regenerateMarkdown(id)**:
   - Recovery utility to rebuild `.md` from `.json`

## Important Bug Fixes

### FIXED: Wrong "Latest" Resolution
**Before**: Sorted UUIDs alphabetically (random order)
**After**: Sorts by file `mtime` (actual creation time)

### FIXED: No Validation on Load
**Before**: Loaded JSON trusted blindly
**After**: Re-validates with Zod schema to prevent injection

### FIXED: Meta Overwrite Bug
**Before**: `...input` could overwrite generated meta fields
**After**: Explicitly rejects input with `meta` field

### FIXED: Non-Atomic Writes
**Before**: Direct `writeFileSync()` could corrupt on crash
**After**: Atomic write pattern (temp file → rename)

### FIXED: Path Traversal Vulnerability
**Before**: ID like `../../../etc/passwd` could escape directory
**After**: UUID validation via `sanitizeId()`

## Error Handling Pattern

All errors use custom `MemoryError` class with:
- Human-readable message
- Machine-readable error code (e.g., `NO_MEMORIES`, `SAVE_FAILED`)
- Optional details for debugging

Scripts format errors consistently for CLI output.

## Schema Versioning Strategy

**Current**: Version 1.0 only

**Future-Proofing**:
- Schema uses union type: `z.union([AgentMemorySchemaV1, ...])`
- Easy to add V2, V3, etc. with migrations
- Load function can detect version and migrate if needed

## Design Philosophy

1. **Explicit over Implicit**: User controls what gets saved
2. **Deterministic**: Same input always produces same output
3. **Portable**: Plain text files, no proprietary formats
4. **Fail Fast**: Clear errors at boundaries, don't propagate corruption
5. **Git-Friendly**: Markdown + JSON, both diffable and mergeable
6. **Type-Safe**: TypeScript throughout, no `any` types
7. **Recoverable**: Markdown regenerable from JSON if lost

## Testing Strategy

Currently no automated tests. To test manually:

```bash
# Build
npm run build

# Test save (should create memory/*.json and *.md)
node scripts/save-memory.js '{"project":"test","context":{"goal":"test","techStack":["node"],"constraints":[]},"state":{"implemented":[],"pending":[]},"decisions":[],"nextActions":[]}'

# Test load latest
node scripts/load-memory.js

# Test load specific
node scripts/load-memory.js --id=<uuid-from-above>

# Test list
node scripts/load-memory.js --list
```

## Dependencies

**Runtime**:
- `uuid`: ID generation and validation
- `zod`: Schema validation (v4)

**Dev**:
- `typescript`: Compilation
- `@types/node`: Node.js type definitions

**Removed**:
- ❌ `@modelcontextprotocol/sdk` (was incorrect, not needed for plugins)
- ❌ `ts-node` (not needed, use build output)
