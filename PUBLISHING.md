# Publishing & Installation Guide

This guide covers how to publish and install the Claude Memory Plugin.

## For Plugin Authors (Publishing)

### Prerequisites

- [x] Repository on GitHub: https://github.com/q-public/claude-mcp-memory
- [x] Marketplace metadata: `.claude-plugin/marketplace.json`
- [x] License file: `LICENSE`
- [x] Complete documentation: README, CLAUDE.md, etc.
- [x] Working build: `npm run build` succeeds
- [x] Git tags for versioning

### Publishing Steps

#### 1. Tag the Release

```bash
# Ensure you're on main with latest changes
git checkout main
git pull

# Create and push version tag
git tag -a v0.2.0 -m "Release v0.2.0 - Production ready"
git push origin v0.2.0
```

#### 2. Create GitHub Release

1. Go to https://github.com/q-public/claude-mcp-memory/releases/new
2. Select tag: `v0.2.0`
3. Release title: `v0.2.0 - Production Ready`
4. Description: Copy from `CHANGELOG.md` for v0.2.0
5. Attach any assets (optional)
6. Click "Publish release"

#### 3. Submit to Claude Code Plugin Marketplace

**Method 1: Via Claude Code CLI**

If official marketplace submission is available:

```bash
claude plugin publish
```

**Method 2: Direct Installation URL**

Users can install directly from GitHub:

```bash
claude plugin install https://github.com/q-public/claude-mcp-memory
```

Or:

```bash
/plugin install https://github.com/q-public/claude-mcp-memory
```

**Method 3: Manual Installation**

Users can manually clone and install (see User Installation below).

---

## For Users (Installation)

### Option 1: Install from GitHub URL (Recommended)

In Claude Code, run:

```bash
/plugin install https://github.com/q-public/claude-mcp-memory
```

Or via CLI:

```bash
claude plugin install https://github.com/q-public/claude-mcp-memory
```

### Option 2: Manual Installation

1. **Clone the repository**:
   ```bash
   cd ~/.claude/plugins  # or your preferred plugin directory
   git clone https://github.com/q-public/claude-mcp-memory.git
   cd claude-mcp-memory
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the plugin**:
   ```bash
   npm run build
   ```

4. **Verify installation**:
   ```bash
   # Check that dist/ directory was created
   ls -la dist/
   ```

5. **Restart Claude Code** or reload plugins

6. **Test the plugin**:
   In Claude Code, type:
   ```
   /memory
   ```
   You should see three subcommands: summarize, save, load

### Option 3: Install from NPM (Future)

If published to NPM:

```bash
npm install -g claude-memory-plugin
```

---

## Verification

After installation, verify the plugin works:

```bash
# In Claude Code
/memory summarize
```

Expected: Claude provides a structured JSON template for memory

---

## Updating the Plugin

### For Users

**If installed via URL/CLI:**
```bash
claude plugin update claude-memory
```

**If manually installed:**
```bash
cd ~/.claude/plugins/claude-mcp-memory
git pull
npm install
npm run build
```

### For Authors

When releasing a new version:

1. Update version in:
   - `package.json`
   - `.claude-plugin/marketplace.json`
   - `.claude-plugin/plugin.json`

2. Update `CHANGELOG.md`

3. Commit changes:
   ```bash
   git add .
   git commit -m "Release v0.3.0"
   git push
   ```

4. Tag and release (see Publishing Steps above)

---

## Uninstallation

### Via CLI
```bash
claude plugin uninstall claude-memory
```

### Manually
```bash
rm -rf ~/.claude/plugins/claude-mcp-memory
```

---

## Marketplace Metadata

The plugin includes `.claude-plugin/marketplace.json` with metadata for marketplace listing:

- **Name**: claude-memory
- **Display Name**: Memory Plugin
- **Category**: Productivity, Workflow
- **Icon**: 💾
- **Commands**: /memory (summarize, save, load)

---

## Support

- **Issues**: https://github.com/q-public/claude-mcp-memory/issues
- **Documentation**: See [README.md](README.md)
- **Examples**: See [examples/](examples/)
- **Verification**: See [VERIFICATION.md](VERIFICATION.md)

---

## License

ISC License - see [LICENSE](LICENSE) file for details.
