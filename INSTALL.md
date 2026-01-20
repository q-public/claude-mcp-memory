# Quick Installation Guide

## TL;DR

```bash
/plugin install https://github.com/q-public/claude-mcp-memory
```

---

## Detailed Steps

### Method 1: Direct URL (Easiest)

In Claude Code, run:

```bash
/plugin install https://github.com/q-public/claude-mcp-memory
```

Done! The plugin will be automatically installed and available.

### Method 2: Manual Installation

1. **Clone the repository:**
   ```bash
   cd ~/.claude/plugins
   git clone https://github.com/q-public/claude-mcp-memory.git
   cd claude-mcp-memory
   ```

2. **Install and build:**
   ```bash
   npm install
   npm run build
   ```

3. **Restart Claude Code**

4. **Verify:**
   ```
   /memory
   ```
   Should show: summarize, save, load

---

## Quick Start

### 1. End Your Session

```
You: /memory summarize
```

Claude will output structured JSON.

### 2. Save Memory

```
You: /memory save {
  "project": "my-app",
  "context": {
    "goal": "Build user authentication",
    "techStack": ["TypeScript", "Express"],
    "constraints": ["Use existing DB schema"]
  },
  "state": {
    "implemented": ["User model", "Login endpoint"],
    "pending": ["Password reset", "Email verification"]
  },
  "decisions": [
    {
      "decision": "Use JWT tokens",
      "rationale": "Stateless, works with API gateway"
    }
  ],
  "nextActions": ["Add rate limiting", "Write tests"]
}
```

### 3. Resume Later

In a new session:

```
You: /memory load
```

Claude will load the latest memory and continue where you left off.

---

## Requirements

- **Node.js**: >= 18.0.0
- **Claude Code**: Latest version

---

## Troubleshooting

### Plugin not showing up

1. Restart Claude Code
2. Check plugin directory: `~/.claude/plugins/claude-mcp-memory`
3. Verify build succeeded: `ls dist/` should show .js files

### Build fails

```bash
cd ~/.claude/plugins/claude-mcp-memory
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Commands not working

1. Ensure build completed: `npm run build`
2. Check for errors: `cat scripts/save-memory.js` should exist
3. Try reinstalling the plugin

---

## Getting Help

- **Documentation**: [README.md](README.md)
- **Issues**: https://github.com/q-public/claude-mcp-memory/issues
- **Examples**: See [examples/](examples/) directory

---

## Uninstall

```bash
/plugin uninstall claude-memory
```

Or manually:

```bash
rm -rf ~/.claude/plugins/claude-mcp-memory
```

---

**That's it!** You now have persistent memory across Claude Code sessions. 💾
