#!/usr/bin/env node

/**
 * Save memory snapshot from stdin
 * Usage: echo '{"project":"..."}' | node save-memory-stdin.js
 */

import { normalizeMemory } from '../dist/memory/normalize.js'
import { saveMemoryToFs } from '../dist/storage/fs.js'
import { formatError } from '../dist/utils/errors.js'

async function main() {
  try {
    // Read from stdin
    let inputData = ''

    for await (const chunk of process.stdin) {
      inputData += chunk
    }

    if (!inputData.trim()) {
      console.error('❌ No input provided')
      console.error('\n💡 Usage: Paste your JSON from /memory summarize')
      process.exit(1)
    }

    // Parse and normalize
    const input = JSON.parse(inputData)
    const normalized = normalizeMemory(input)

    // Save to filesystem
    await saveMemoryToFs(normalized)

    // Success output
    console.log('✅ Memory saved successfully!')
    console.log('')
    console.log('📋 Details:')
    console.log(`   ID: ${normalized.meta.id}`)
    console.log(`   Project: ${normalized.meta.project}`)
    console.log(`   Created: ${new Date(normalized.meta.createdAt).toLocaleString()}`)
    console.log('')
    console.log('📁 Files created:')
    console.log(`   memory/${normalized.meta.id}.json`)
    console.log(`   memory/${normalized.meta.id}.md`)
    console.log('')
    console.log('💡 To resume from this memory later, use:')
    console.log(`   /memory load --id=${normalized.meta.id}`)
    console.log('   or simply: /memory load (loads latest)')
  } catch (error) {
    console.error('❌ Failed to save memory')
    console.error(`\n${formatError(error)}`)
    console.error('\n💡 Tips:')
    console.error('   - Make sure your JSON is valid')
    console.error('   - Check that all required fields are present')
    console.error('   - Run /memory summarize to get the correct format')
    process.exit(1)
  }
}

main()
