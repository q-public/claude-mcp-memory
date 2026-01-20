# Changelog

All notable changes to the Claude Memory Plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-01-21

### Added
- Initial production-ready release
- `/memory summarize` command with structured JSON template
- `/memory save` command with validation and dual-format storage
- `/memory load` command with latest/specific ID support
- Atomic file writes for data integrity
- Path traversal protection for security
- Schema validation on both save and load
- Custom error handling with clear error codes
- Markdown generation for human-readable summaries
- Example memory files in `examples/` directory
- Comprehensive documentation (README, CLAUDE.md, VERIFICATION.md)
- Complete test suite with verification steps

### Security
- UUID validation to prevent path traversal attacks
- Input sanitization to reject malicious data
- Re-validation of loaded data against schema
- Protection against meta field overwrites

### Changed
- Complete architectural refactor from MCP server to Claude Code plugin
- Switched from synchronous to asynchronous file I/O
- Improved "latest" resolution using file modification time (not UUID sort)
- Enhanced error messages with troubleshooting tips

### Fixed
- Fixed non-functional MCP server architecture (breaking change)
- Fixed latest memory resolution (was using random UUID sort)
- Fixed missing validation on load operations
- Fixed race conditions in file writes
- Fixed meta field overwrite vulnerability
- Fixed blocking I/O in async functions
- All 29 bugs identified in initial audit

### Documentation
- README.md with complete user guide
- CLAUDE.md with architecture details
- VERIFICATION.md with test suite
- AUDIT_SUMMARY.md with full audit report
- Example memory snapshots

## [0.1.0] - 2025-XX-XX

### Note
This version was non-functional and has been completely replaced in v0.2.0.

---

## Release Notes

### v0.2.0 Highlights

This is the first production-ready release of the Claude Memory Plugin. The entire codebase has been audited, refactored, and rebuilt from the ground up as a proper Claude Code plugin.

**Key Features:**
- 💾 **Persistent Memory**: Save conversation context and resume work later
- 🔒 **Secure**: Input validation, path traversal protection, schema enforcement
- 📝 **Dual Format**: Both JSON (machine-readable) and Markdown (human-readable)
- ⚡ **Reliable**: Atomic writes, async I/O, comprehensive error handling
- 🔄 **Future-Proof**: Schema versioning support for evolution
- 📚 **Well-Documented**: Complete guides, examples, and test suite

**Breaking Changes:**
- Complete architectural restructure
- Not compatible with v0.1.0 (which was non-functional)
- New command structure and workflow

**Migration:**
Not applicable - v0.1.0 was non-functional, so there are no existing users to migrate.
