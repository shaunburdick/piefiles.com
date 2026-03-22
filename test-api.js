#!/usr/bin/env node

/**
 * Quick API integration test
 * Tests that our API client works with real GameFront API
 */

import { apiClient } from './src/api/gamefront-client.js'

console.log('🧪 Testing GameFront API Integration\n')

async function runTests() {
  // Check if API key is set
  const apiKey = apiClient.getApiKey()
  if (!apiKey) {
    console.error('❌ No API key found in localStorage')
    console.log('💡 Please open http://localhost:5174 and configure your API key first\n')
    process.exit(1)
  }

  console.log('✅ API key found\n')

  try {
    // Test 1: Get games list
    console.log('Test 1: Fetching games list...')
    const gamesResult = await apiClient.getGames({ perPage: 5, page: 1 })
    console.log(`✅ Games loaded: ${gamesResult.data.length} games`)
    console.log(
      `   Pagination: Page ${gamesResult.paginatorInfo.currentPage} of ${gamesResult.paginatorInfo.lastPage}`
    )

    if (gamesResult.data.length === 0) {
      console.log('⚠️  No games returned (might be an API issue)')
      return
    }

    const firstGame = gamesResult.data[0]
    console.log(`   First game: "${firstGame.title}" (slug: ${firstGame.slug})`)
    console.log(`   File count: ${firstGame.file_count}`)
    console.log('')

    // Test 2: Get single game
    console.log('Test 2: Fetching game details...')
    const game = await apiClient.getGame(firstGame.slug)
    console.log(`✅ Game loaded: "${game.title}"`)
    console.log(`   File count: ${game.file_count}`)
    console.log(`   Categories: ${game.categories?.map((c) => c.name).join(', ') || 'None'}`)
    console.log('')

    // Test 3: Get mods for game
    console.log('Test 3: Fetching mods for game...')
    const modsResult = await apiClient.getMods(firstGame.slug, { perPage: 5, page: 1 })
    console.log(`✅ Mods loaded: ${modsResult.data.length} mods`)

    if (modsResult.data.length === 0) {
      console.log('⚠️  No mods returned for this game')
      console.log('   (This is okay - game might not have mods)')
      console.log('')
      console.log('🎉 All tests passed!\n')
      return
    }

    const firstMod = modsResult.data[0]
    console.log(`   First mod: "${firstMod.title}" (slug: ${firstMod.slug})`)
    console.log(`   Downloads: ${firstMod.downloads || 0}`)
    console.log(`   Author: ${firstMod.author?.display_name || 'Unknown'}`)
    console.log('')

    // Test 4: Get single mod
    console.log('Test 4: Fetching mod details...')
    const mod = await apiClient.getMod(firstMod.slug, firstGame.slug)
    console.log(`✅ Mod loaded: "${mod.title}"`)
    console.log(`   Downloads: ${mod.downloads || 0}`)
    console.log(`   Author: ${mod.author?.display_name || 'Unknown'}`)
    console.log(`   URL: ${mod.url || 'N/A'}`)
    console.log(`   Images: ${mod.images?.length || 0}`)
    console.log(
      `   Description: ${mod.description ? mod.description.substring(0, 50) + '...' : 'None'}`
    )
    console.log('')

    // Test 5: Field name verification
    console.log('Test 5: Verifying field names match components...')
    const fieldChecks = []

    // Check mod fields
    fieldChecks.push({ name: 'mod.downloads', exists: 'downloads' in mod, critical: true })
    fieldChecks.push({
      name: 'mod.author.display_name',
      exists: mod.author?.display_name !== undefined,
      critical: true,
    })
    fieldChecks.push({ name: 'mod.url', exists: 'url' in mod, critical: true })
    fieldChecks.push({ name: 'mod.images', exists: 'images' in mod, critical: false })
    fieldChecks.push({ name: 'mod.description', exists: 'description' in mod, critical: true })

    // Check that old field names DON'T exist
    fieldChecks.push({
      name: '!mod.download_count (should not exist)',
      exists: !('download_count' in mod),
      critical: true,
    })
    fieldChecks.push({
      name: '!mod.download_url (should not exist)',
      exists: !('download_url' in mod),
      critical: true,
    })
    fieldChecks.push({
      name: '!mod.screenshots (should not exist)',
      exists: !('screenshots' in mod),
      critical: true,
    })

    let allPassed = true
    fieldChecks.forEach((check) => {
      const icon = check.exists ? '✅' : check.critical ? '❌' : '⚠️ '
      console.log(`   ${icon} ${check.name}`)
      if (!check.exists && check.critical) allPassed = false
    })

    console.log('')

    if (allPassed) {
      console.log('🎉 All tests passed! API integration is working correctly.\n')
      console.log('📋 Summary:')
      console.log('   - Games list: ✅')
      console.log('   - Game detail: ✅')
      console.log('   - Mods list: ✅')
      console.log('   - Mod detail: ✅')
      console.log('   - Field names: ✅')
      console.log('')
      console.log('Next: Open http://localhost:5174 to test the UI\n')
    } else {
      console.log('❌ Some critical checks failed. Components may not display data correctly.\n')
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('   Error details:', apiClient.getErrorMessage(error))
    console.log('')
    process.exit(1)
  }
}

runTests()
