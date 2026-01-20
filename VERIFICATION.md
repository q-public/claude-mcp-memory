# Verification Guide

This document provides test cases and verification steps for the Claude Memory plugin.

## Pre-Flight Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] TypeScript compiled successfully (`npm run build`)
- [ ] `dist/` directory contains `.js` files
- [ ] `commands/memory/` contains `.md` files
- [ ] `.claude-plugin/plugin.json` exists

## Verification Steps

### 1. Build Verification

```bash
npm run build
```

**Expected Output**:
- ✅ No TypeScript errors
- ✅ `dist/` directory created
- ✅ Files exist:
  - `dist/memory/schema.js`
  - `dist/memory/normalize.js`
  - `dist/storage/fs.js`
  - `dist/storage/markdown.js`
  - `dist/utils/id.js`
  - `dist/utils/errors.js`

### 2. Save Memory Test

```bash
node scripts/save-memory.js '{
  "project": "test-project",
  "context": {
    "goal": "Build and test memory plugin",
    "techStack": ["TypeScript", "Node.js", "Zod"],
    "constraints": ["Must be git-friendly", "No database required"]
  },
  "state": {
    "implemented": ["Plugin structure", "Schema validation", "Storage layer"],
    "pending": ["End-to-end testing", "Documentation review"]
  },
  "decisions": [
    {
      "decision": "Use filesystem for storage",
      "rationale": "Portable, versionable, no dependencies"
    }
  ],
  "nextActions": ["Run verification tests", "Deploy to production"]
}'
```

**Expected Output**:
```
✅ Memory saved successfully!

📋 Details:
   ID: <uuid-v4>
   Project: test-project
   Created: <timestamp>

📁 Files created:
   memory/<uuid>.json
   memory/<uuid>.md

💡 To resume from this memory later, use:
   /memory load --id=<uuid>
   or simply: /memory load (loads latest)
```

**Verify Files Created**:
```bash
ls -la memory/
# Should show: <uuid>.json and <uuid>.md
```

### 3. Load Latest Memory Test

```bash
node scripts/load-memory.js
```

**Expected Output**:
- ✅ Displays JSON memory structure in code block
- ✅ Shows metadata (ID, created date, project)
- ✅ No errors

### 4. Load Specific Memory Test

```bash
node scripts/load-memory.js --id=<uuid-from-step-2>
```

**Expected Output**:
- ✅ Loads the specific memory
- ✅ Same as step 3 output

### 5. List Memories Test

```bash
node scripts/load-memory.js --list
```

**Expected Output**:
```
📚 Found 1 memory snapshot:

📌 <uuid>
   Project: test-project
   Created: <timestamp>
   (This is the latest memory)
```

### 6. Error Handling Tests

#### Test 6a: Invalid JSON

```bash
node scripts/save-memory.js 'not valid json'
```

**Expected**:
- ❌ Error: Invalid JSON
- ✅ Helpful error message about JSON syntax

#### Test 6b: Missing Required Fields

```bash
node scripts/save-memory.js '{
  "project": "incomplete"
}'
```

**Expected**:
- ❌ Validation failed
- ✅ Clear message about missing fields

#### Test 6c: Load Non-Existent Memory

```bash
node scripts/load-memory.js --id=00000000-0000-0000-0000-000000000000
```

**Expected**:
- ❌ Failed to load memory
- ✅ Error code `LOAD_FAILED`

#### Test 6d: Load When No Memories Exist

```bash
# First, temporarily move memory directory
mv memory memory_backup
node scripts/load-memory.js
mv memory_backup memory
```

**Expected**:
- ❌ Error: No memory files found
- ✅ Error code `NO_MEMORIES`

### 7. Markdown Generation Test

Check that generated `.md` file is human-readable:

```bash
cat memory/<uuid>.md
```

**Expected Structure**:
```markdown
# Agent Memory – <uuid>

**Created:** <date>
**Project:** test-project
**Version:** 1.0

## Goal
Build and test memory plugin

## Tech Stack
- TypeScript
- Node.js
- Zod

## Constraints
- Must be git-friendly
- No database required

## ✅ Implemented
- Plugin structure
- Schema validation
- Storage layer

## ⏳ Pending
- End-to-end testing
- Documentation review

## 🔀 Key Decisions
1. **Use filesystem for storage**
   - Rationale: Portable, versionable, no dependencies

## 🎯 Next Actions
- [ ] Run verification tests
- [ ] Deploy to production
```

### 8. Schema Validation Tests

#### Test 8a: Reject Meta Field in Input

```bash
node scripts/save-memory.js '{
  "meta": {"id": "fake-id"},
  "project": "test"
}'
```

**Expected**:
- ❌ Error: Input should not contain "meta" field
- ✅ Error code `INVALID_INPUT_META`

#### Test 8b: Empty Arrays Allowed

```bash
node scripts/save-memory.js '{
  "project": "minimal",
  "context": {
    "goal": "Test minimal memory",
    "techStack": [],
    "constraints": []
  },
  "state": {
    "implemented": [],
    "pending": []
  },
  "decisions": [],
  "nextActions": []
}'
```

**Expected**:
- ⚠️ May fail with Zod validation (arrays must have min 1)
- This is intentional - empty arrays not allowed

### 9. Latest Resolution Test

Create multiple memories with delays to test mtime sorting:

```bash
# Create first memory
node scripts/save-memory.js '{"project":"first",...}'
sleep 2

# Create second memory
node scripts/save-memory.js '{"project":"second",...}'

# Load latest - should be "second"
node scripts/load-memory.js
```

**Expected**:
- ✅ Loads "second" project memory (most recent)
- ✅ Confirms mtime-based sorting works

### 10. Atomic Write Test

This test is difficult to verify manually. You can:

1. Check that temp files don't persist:
   ```bash
   ls memory/*.tmp
   # Should show: No such file or directory
   ```

2. Verify file integrity after successful save:
   ```bash
   cat memory/<uuid>.json | jq .
   # Should parse successfully
   ```

## Integration Test (Full Workflow)

Simulate actual Claude Code usage:

```bash
# Step 1: User runs /memory summarize (manual - just structure data)

# Step 2: User runs /memory save with JSON
node scripts/save-memory.js '<json-from-summarize>'

# Step 3: In "new session", user runs /memory load
node scripts/load-memory.js

# Verify memory is correctly injected and formatted
```

## Plugin Installation Test

1. Copy plugin to Claude Code plugins directory:
   ```bash
   cp -r . ~/.claude/plugins/claude-memory
   ```

2. In Claude Code, verify commands are available:
   ```
   /memory<TAB>
   # Should show: summarize, save, load
   ```

3. Test each command in Claude Code interface

## Security Tests

### Path Traversal Protection

```bash
# Try to escape memory directory
node scripts/load-memory.js --id="../../../etc/passwd"
```

**Expected**:
- ❌ Error: Invalid memory ID
- ✅ No file system access outside memory/

## Performance Checks

### Large Memory Test

Create a memory with many items:

```bash
node scripts/save-memory.js '{
  "project": "large-test",
  "context": {
    "goal": "Test performance",
    "techStack": ["a","b","c",...100 items],
    "constraints": ["x","y","z",...50 items]
  },
  ...
}'
```

**Expected**:
- ✅ Completes in < 1 second
- ✅ JSON file size reasonable
- ✅ Markdown file renders correctly

## Checklist Summary

Core Functionality:
- [ ] Build succeeds without errors
- [ ] Save creates both .json and .md files
- [ ] Load retrieves correct memory
- [ ] Latest resolution uses mtime
- [ ] List shows all memories

Error Handling:
- [ ] Invalid JSON rejected with clear message
- [ ] Missing fields caught by validation
- [ ] Non-existent ID handled gracefully
- [ ] Meta field in input rejected

Security:
- [ ] Path traversal blocked
- [ ] Loaded data validated
- [ ] UUIDs properly sanitized

Quality:
- [ ] Markdown human-readable
- [ ] JSON properly formatted
- [ ] No .tmp files left behind
- [ ] Error messages helpful

## Bug Fix Verification

Verify each bug from the audit was fixed:

| Bug | Test | Status |
|-----|------|--------|
| BUG-003: Latest resolution broken | Create 2+ memories, load latest | ✅ Fixed |
| BUG-004: No validation on load | Load memory, check validation | ✅ Fixed |
| BUG-005: No error handling | Trigger errors, check messages | ✅ Fixed |
| EDGE-004: Corrupted JSON | Manually corrupt .json, try load | ✅ Fixed |
| RISK-002: Meta overwrite | Try saving with meta field | ✅ Fixed |
| SEC-001: Path traversal | Try ../ in ID | ✅ Fixed |
| SYNC-001: Non-atomic writes | Check for .tmp files | ✅ Fixed |

All critical bugs have been addressed!
