#!/usr/bin/env node

/**
 * Save memory snapshot from JSON input
 * Usage: node save-memory.js <json-string>
 */

import { normalizeMemory } from '../dist/memory/normalize.js'
import { saveMemoryToFs } from '../dist/storage/fs.js'
import { formatError } from '../dist/utils/errors.js'

async function main() {
  try {
    // Get JSON input from command line arguments
    const args = process.argv.slice(2)
    const jsonInput = args.join(' ').trim()

    if (!jsonInput) {
      console.error('❌ Error: No input provided')
      console.error('\nUsage: node save-memory.js \'<json-object>\'')
      console.error('\nExample:')
      console.error('node save-memory.js \'{"project":"my-app","context":{...}}\'')
      process.exit(1)
    }

    // Parse JSON
    let input
    try {
      input = JSON.parse(jsonInput)
    } catch (error) {
      console.error('❌ Error: Invalid JSON')
      console.error('\nThe input must be valid JSON. Check for:')
      console.error('- Missing quotes around keys and string values')
      console.error('- Trailing commas')
      console.error('- Unescaped special characters')
      console.error(`\nDetails: ${error.message}`)
      process.exit(1)
    }

    // Normalize and validate
    const memory = normalizeMemory(input)

    // Save to filesystem
    await saveMemoryToFs(memory)

    // Success output
    console.log(`✅ Memory saved successfully!`)
    console.log(`\n📋 Details:`)
    console.log(`   ID: ${memory.meta.id}`)
    console.log(`   Project: ${memory.meta.project}`)
    console.log(`   Created: ${new Date(memory.meta.createdAt).toLocaleString()}`)
    console.log(`\n📁 Files created:`)
    console.log(`   memory/${memory.meta.id}.json`)
    console.log(`   memory/${memory.meta.id}.md`)
    console.log(`\n💡 To resume from this memory later, use:`)
    console.log(`   /memory load --id=${memory.meta.id}`)
    console.log(`   or simply: /memory load (loads latest)`)
  } catch (error) {
    console.error('❌ Failed to save memory')
    console.error(`\n${formatError(error)}`)
    process.exit(1)
  }
}

main()
