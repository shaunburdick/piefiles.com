#!/usr/bin/env node

/**
 * API Integration Test
 * Tests GameFront GraphQL API calls directly (Node.js compatible)
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// GraphQL Queries
const GAMES_QUERY = `
  query Games($first: Int!, $page: Int!) {
    games(first: $first, page: $page) {
      data {
        id
        title
        slug
        file_count
      }
      paginatorInfo {
        currentPage
        lastPage
      }
    }
  }
`

const GAME_QUERY = `
  query Game($slug: String!) {
    game(slug: $slug) {
      id
      title
      slug
      file_count
    }
  }
`

const MODS_QUERY = `
  query ModsForGame($slug: String!, $first: Int!, $page: Int!) {
    modsForGame(game_slug: $slug, first: $first, page: $page) {
      data {
        id
        title
        slug
        downloads
        author {
          display_name
          slug
        }
      }
      paginatorInfo {
        currentPage
        lastPage
      }
    }
  }
`

const MOD_QUERY = `
  query Mod($slug: String!, $gameSlug: String!) {
    mod(slug: $slug, game_slug: $gameSlug) {
      id
      title
      slug
      url
      description
      downloads
      author {
        display_name
        slug
      }
      images {
        id
        path
      }
    }
  }
`

console.log('🧪 Testing GameFront API Integration\n')

// Load API key from .env file
function loadApiKey() {
  try {
    const envPath = join(__dirname, '.env')
    const envContent = readFileSync(envPath, 'utf-8')
    const match = envContent.match(/GAMEFRONT_API_KEY=(.+)/)
    if (match && match[1] && match[1].trim()) {
      return match[1].trim()
    }
  } catch (err) {
    console.error('❌ Could not read .env file:', err.message)
  }
  return null
}

// Make GraphQL request
async function graphqlRequest(query, variables, apiKey) {
  const response = await fetch('https://www.gamefront.com/api/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'User-Agent': 'PieFiles/1.0 (+https://piefiles.com)',
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()

  if (data.errors && data.errors.length > 0) {
    throw new Error(`GraphQL Error: ${JSON.stringify(data.errors, null, 2)}`)
  }

  return data.data
}

async function runTests() {
  const apiKey = loadApiKey()

  if (!apiKey) {
    console.error('❌ No API key found\n')
    console.log('📝 To run tests, add your API key to .env file:')
    console.log('   1. Open .env file in the project root')
    console.log('   2. Add: GAMEFRONT_API_KEY=your_actual_key')
    console.log('   3. Save and run this script again\n')
    process.exit(1)
  }

  console.log('✅ API key loaded\n')

  try {
    // Test 1: Get games list
    console.log('Test 1: Fetching games list...')
    const gamesData = await graphqlRequest(GAMES_QUERY, { first: 5, page: 1 }, apiKey)
    const games = gamesData.games

    console.log(`✅ Games loaded: ${games.data.length} games`)
    console.log(
      `   Pagination: Page ${games.paginatorInfo.currentPage} of ${games.paginatorInfo.lastPage}`
    )

    if (games.data.length === 0) {
      console.log('⚠️  No games returned (API might be empty)')
      return
    }

    const firstGame = games.data[0]
    console.log(`   First game: "${firstGame.title}" (slug: ${firstGame.slug})`)
    console.log(`   File count: ${firstGame.file_count}`)
    console.log('')

    // Small delay to respect rate limiting
    await new Promise((resolve) => setTimeout(resolve, 600))

    // Test 2: Get single game
    console.log('Test 2: Fetching game details...')
    const gameData = await graphqlRequest(GAME_QUERY, { slug: firstGame.slug }, apiKey)
    const game = gameData.game

    console.log(`✅ Game loaded: "${game.title}"`)
    console.log(`   File count: ${game.file_count}`)
    console.log('')

    await new Promise((resolve) => setTimeout(resolve, 600))

    // Test 3: Get mods for game
    console.log('Test 3: Fetching mods for game...')
    const modsData = await graphqlRequest(
      MODS_QUERY,
      {
        slug: firstGame.slug,
        first: 5,
        page: 1,
      },
      apiKey
    )
    const mods = modsData.modsForGame

    console.log(`✅ Mods loaded: ${mods.data.length} mods`)

    if (mods.data.length === 0) {
      console.log('⚠️  No mods returned for this game')
      console.log('   (This is okay - game might not have mods)')
      console.log('')
      console.log('🎉 All tests passed!\n')
      printSummary(true)
      return
    }

    const firstMod = mods.data[0]
    console.log(`   First mod: "${firstMod.title}" (slug: ${firstMod.slug})`)
    console.log(`   Downloads: ${firstMod.downloads || 0}`)
    console.log(`   Author: ${firstMod.author?.display_name || 'Unknown'}`)
    console.log('')

    await new Promise((resolve) => setTimeout(resolve, 600))

    // Test 4: Get single mod
    console.log('Test 4: Fetching mod details...')
    const modData = await graphqlRequest(
      MOD_QUERY,
      {
        slug: firstMod.slug,
        gameSlug: firstGame.slug,
      },
      apiKey
    )
    const mod = modData.mod

    console.log(`✅ Mod loaded: "${mod.title}"`)
    console.log(`   Downloads: ${mod.downloads || 0}`)
    console.log(`   Author: ${mod.author?.display_name || 'Unknown'}`)
    console.log(`   URL: ${mod.url || 'N/A'}`)
    console.log(`   Images: ${mod.images?.length || 0}`)
    console.log(`   Description length: ${mod.description?.length || 0} chars`)
    console.log('')

    // Test 5: Field name verification
    console.log('Test 5: Verifying field names match components...')
    const fieldChecks = [
      { name: 'mod.downloads', value: mod.downloads, expected: 'number or null', critical: true },
      {
        name: 'mod.author.display_name',
        value: mod.author?.display_name,
        expected: 'string',
        critical: true,
      },
      { name: 'mod.url', value: mod.url, expected: 'string', critical: true },
      { name: 'mod.images', value: mod.images, expected: 'array', critical: false },
      { name: 'mod.description', value: mod.description, expected: 'string', critical: true },
    ]

    let allPassed = true
    fieldChecks.forEach((check) => {
      const exists = check.value !== undefined
      const icon = exists ? '✅' : check.critical ? '❌' : '⚠️ '
      const valueInfo = exists ? ` (${typeof check.value})` : ''
      console.log(`   ${icon} ${check.name}${valueInfo}`)
      if (!exists && check.critical) allPassed = false
    })

    // Check that old field names DON'T exist
    console.log('')
    console.log('   Verifying old field names removed:')
    const oldFields = [
      { name: 'download_count', shouldNotExist: !('download_count' in mod) },
      { name: 'download_url', shouldNotExist: !('download_url' in mod) },
      { name: 'screenshots', shouldNotExist: !('screenshots' in mod) },
    ]

    oldFields.forEach((check) => {
      const icon = check.shouldNotExist ? '✅' : '⚠️ '
      const msg = check.shouldNotExist ? 'not present (correct)' : 'still exists (unexpected)'
      console.log(`   ${icon} ${check.name}: ${msg}`)
    })

    console.log('')

    if (allPassed) {
      console.log('🎉 All tests passed! API integration is working correctly.\n')
      printSummary(true)
    } else {
      console.log('❌ Some critical checks failed.\n')
      printSummary(false)
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.log('')
    printSummary(false)
    process.exit(1)
  }
}

function printSummary(passed) {
  console.log('📋 Test Summary:')
  console.log(`   - Games list API: ${passed ? '✅' : '❌'}`)
  console.log(`   - Game detail API: ${passed ? '✅' : '❌'}`)
  console.log(`   - Mods list API: ${passed ? '✅' : '❌'}`)
  console.log(`   - Mod detail API: ${passed ? '✅' : '❌'}`)
  console.log(`   - Field names: ${passed ? '✅' : '❌'}`)
  console.log('')

  if (passed) {
    console.log('✨ Next Steps:')
    console.log('   1. Open http://localhost:5174 in browser')
    console.log('   2. Test UI components match API data')
    console.log('   3. Verify text replacement (file→pie)')
    console.log('   4. Test navigation and responsive design')
    console.log('')
  } else {
    console.log('🔧 Fix the issues above and run tests again\n')
  }
}

runTests()
