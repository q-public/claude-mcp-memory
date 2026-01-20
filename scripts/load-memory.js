#!/usr/bin/env node

/**
 * Load memory snapshot by ID or latest
 * Usage: node load-memory.js [--id=<memory-id>]
 */

import { loadMemoryFromFs, listMemories } from '../dist/storage/fs.js'
import { formatError } from '../dist/utils/errors.js'

async function main() {
  try {
    // Parse arguments
    const args = process.argv.slice(2)
    let id = 'latest'

    // Check for --id=xxx or --id xxx
    for (let i = 0; i < args.length; i++) {
      if (args[i].startsWith('--id=')) {
        id = args[i].substring(5)
      } else if (args[i] === '--id' && args[i + 1]) {
        id = args[i + 1]
      } else if (args[i] === '--list') {
        await listAllMemories()
        return
      }
    }

    // Load memory
    const memory = await loadMemoryFromFs(id)

    // Output formatted memory for Claude to read
    console.log('```json')
    console.log(JSON.stringify(memory, null, 2))
    console.log('```')
    console.log('')
    console.log('---')
    console.log('')
    console.log(`📋 **Memory Loaded:** ${memory.meta.id}`)
    console.log(`📅 **Created:** ${new Date(memory.meta.createdAt).toLocaleString()}`)
    console.log(`📦 **Project:** ${memory.meta.project}`)
    console.log('')
  } catch (error) {
    console.error('❌ Failed to load memory')
    console.error(`\n${formatError(error)}`)
    console.error('\n💡 Tips:')
    console.error('   - Use /memory load (no arguments) to load the latest memory')
    console.error('   - Use /memory load --id=<uuid> to load a specific memory')
    console.error('   - Use /memory load --list to see all available memories')
    process.exit(1)
  }
}

async function listAllMemories() {
  try {
    const memories = await listMemories()

    if (memories.length === 0) {
      console.log('📭 No memories found')
      console.log('\n💡 Use /memory save to create your first memory snapshot')
      return
    }

    console.log(`📚 Found ${memories.length} memory snapshot${memories.length > 1 ? 's' : ''}:\n`)

    memories.forEach((m, i) => {
      const isLatest = i === 0
      console.log(`${isLatest ? '📌' : '  '} ${m.id}`)
      console.log(`   Project: ${m.project}`)
      console.log(`   Created: ${m.createdAt.toLocaleString()}`)
      if (isLatest) {
        console.log(`   (This is the latest memory)`)
      }
      console.log('')
    })
  } catch (error) {
    console.error('❌ Failed to list memories')
    console.error(`\n${formatError(error)}`)
    process.exit(1)
  }
}

main()
