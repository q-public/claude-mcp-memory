# ✅ FIXED: Installation Instructions

The marketplace schema has been fixed. You can now install the plugin!

---

## 🚀 Quick Install (Working Now!)

### Step 1: Add the Marketplace

```bash
/plugin marketplace add q-public/claude-mcp-memory
```

Expected output:
```
✓ Added marketplace justq-claude-plugins from q-public/claude-mcp-memory
```

### Step 2: Install the Plugin

```bash
/plugin install claude-memory@justq-claude-plugins
```

Expected output:
```
✓ Installing claude-memory from justq-claude-plugins...
✓ Running npm install...
✓ Running npm run build...
✓ Plugin claude-memory installed successfully
```

### Step 3: Verify Installation

```bash
/memory
```

Expected: You should see three subcommands: `summarize`, `save`, `load`

---

## Alternative: Direct Installation

If marketplace install doesn't work, use manual method:

```bash
# 1. Clone the repository
cd ~/.claude/plugins
git clone https://github.com/q-public/claude-mcp-memory.git
cd claude-mcp-memory

# 2. Install and build
npm install
npm run build

# 3. Restart Claude Code
# The plugin should now be available
```

---

## What Was Fixed

**Problem**: `Invalid schema: plugins.0.source: Invalid input`

**Root Cause**: The marketplace.json had `"source": "."` which is invalid for a single-plugin repository.

**Solution**: Changed to proper GitHub source format:
```json
{
  "source": {
    "source": "github",
    "repo": "q-public/claude-mcp-memory"
  }
}
```

---

## Using the Plugin

### 1. Summarize Your Session

```bash
/memory summarize
```

Claude will output a structured JSON template.

### 2. Save Your Memory

```bash
/memory save {
  "project": "my-project",
  "context": {
    "goal": "Your project goal",
    "techStack": ["tech1", "tech2"],
    "constraints": ["constraint1"]
  },
  "state": {
    "implemented": ["feature1", "feature2"],
    "pending": ["feature3"]
  },
  "decisions": [
    {
      "decision": "Your decision",
      "rationale": "Why you made it"
    }
  ],
  "nextActions": ["action1", "action2"]
}
```

### 3. Resume Later

In a new Claude Code session:

```bash
/memory load
```

Claude will load your latest memory and continue where you left off!

---

## Troubleshooting

### Marketplace add fails

Try with explicit GitHub URL:
```bash
/plugin marketplace add https://github.com/q-public/claude-mcp-memory.git
```

### Install fails

1. Check Node.js version: `node --version` (needs >= 18)
2. Check npm is installed: `npm --version`
3. Try manual installation (see above)

### Commands not showing

1. Restart Claude Code
2. Check build succeeded: `ls ~/.claude/plugins/claude-mcp-memory/dist/`
3. Verify plugin.json exists: `cat ~/.claude/plugins/claude-mcp-memory/.claude-plugin/plugin.json`

---

## Success!

Once installed, you should be able to use:
- `/memory summarize` - Structure your conversation
- `/memory save <json>` - Save to disk
- `/memory load` - Resume from latest

Happy coding! 💾
