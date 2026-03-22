# Data Model: GameFront Retro Theme

**Feature**: 001-gamefront-retro-theme  
**Date**: 2026-03-22  
**Purpose**: Define entity structures for GameFront API responses and application state

---

## Overview

This document defines the data structures used in PieFiles.com:
1. **GameFront API Entities**: Shapes of data returned from GraphQL API
2. **Application State**: Component state and localStorage

Note: No database or backend storage. All data comes from GameFront API (read-only).

---

## GameFront API Entities

### Game Entity

**Description**: Represents a video game with associated mods/files.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Yes | Unique game ID |
| `title` | String | Yes | Game name (e.g., "Age of Mythology") |
| `slug` | String | Yes | URL-friendly identifier (e.g., "age-of-mythology") |
| `url` | String | Yes | GameFront URL for this game |
| `file_count` | Integer | Yes | Total number of mods/files for this game |
| `categories` | Array<Category> | Yes | Game categories (e.g., Strategy, RTS) |
| `description` | String | No | Game description (if available) |
| `created_at` | String (ISO 8601) | No | When game was added to GameFront |
| `updated_at` | String (ISO 8601) | No | Last update timestamp |

**Example**:
```json
{
  "id": 12345,
  "title": "Age of Mythology",
  "slug": "age-of-mythology",
  "url": "https://www.gamefront.com/games/age-of-mythology",
  "file_count": 1337,
  "categories": [
    { "id": 1, "name": "Strategy", "slug": "strategy" },
    { "id": 2, "name": "RTS", "slug": "rts" }
  ],
  "description": "Epic real-time strategy game featuring mythological units",
  "created_at": "2023-01-15T10:30:00Z",
  "updated_at": "2026-03-20T14:22:00Z"
}
```

**Text Replacement Rules**:
- Apply to: `title`, `description`
- "Age of Mythology" → stays the same (no "file" word)
- If title was "File Manager" → becomes "Pie Manager"

---

### Mod Entity

**Description**: Represents a mod, map, or file for a game.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Yes | Unique mod ID |
| `title` | String | Yes | Mod name |
| `slug` | String | Yes | URL-friendly identifier |
| `description` | String | Yes | Mod description (may contain HTML) |
| `file_size` | Integer | Yes | Size in bytes |
| `download_count` | Integer | Yes | Total downloads |
| `download_url` | String | Yes | Direct download link (GameFront) |
| `author` | String | No | Mod creator username |
| `author_url` | String | No | Link to author profile |
| `uploaded_at` | String (ISO 8601) | Yes | Upload timestamp |
| `updated_at` | String (ISO 8601) | No | Last modified timestamp |
| `screenshots` | Array<String> | No | Array of image URLs |
| `categories` | Array<Category> | No | Mod categories (e.g., Maps, Skins) |
| `game` | Game | No | Parent game object (if included in query) |
| `version` | String | No | Mod version number |
| `compatibility` | String | No | Game version compatibility |

**Example**:
```json
{
  "id": 67890,
  "title": "Epic Battle Map v2",
  "slug": "epic-battle-map-v2",
  "description": "A custom map file for multiplayer battles. This file includes new terrain.",
  "file_size": 5242880,
  "download_count": 12500,
  "download_url": "https://www.gamefront.com/mods/epic-battle-map-v2/download",
  "author": "ModMaster99",
  "author_url": "https://www.gamefront.com/users/modmaster99",
  "uploaded_at": "2025-11-10T08:15:00Z",
  "updated_at": "2025-12-01T10:00:00Z",
  "screenshots": [
    "https://cdn.gamefront.com/screenshots/epic-battle-map-1.jpg",
    "https://cdn.gamefront.com/screenshots/epic-battle-map-2.jpg"
  ],
  "categories": [
    { "id": 10, "name": "Maps", "slug": "maps" }
  ],
  "version": "2.0",
  "compatibility": "Game version 1.0+"
}
```

**Text Replacement Rules**:
- Apply to: `title`, `description`
- "Epic Battle Map" → stays the same
- "A custom map file" → "A custom map pie"
- "This file includes" → "This pie includes"

---

### Category Entity

**Description**: Represents a game or mod category/tag.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Yes | Unique category ID |
| `name` | String | Yes | Category name |
| `slug` | String | Yes | URL-friendly identifier |
| `description` | String | No | Category description |

**Example**:
```json
{
  "id": 1,
  "name": "Strategy",
  "slug": "strategy",
  "description": "Turn-based and real-time strategy games"
}
```

**Text Replacement Rules**:
- Apply to: `name`, `description`
- "Strategy" → stays the same
- If name was "File Management" → becomes "Pie Management"

---

### PaginatorInfo Entity

**Description**: Pagination metadata for paginated lists.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `currentPage` | Integer | Yes | Current page number (1-indexed) |
| `lastPage` | Integer | Yes | Total number of pages |
| `perPage` | Integer | Yes | Items per page (default: 20) |
| `total` | Integer | Yes | Total items across all pages |
| `hasMorePages` | Boolean | Yes | True if more pages exist |
| `from` | Integer | No | Index of first item on page |
| `to` | Integer | No | Index of last item on page |

**Example**:
```json
{
  "currentPage": 2,
  "lastPage": 67,
  "perPage": 20,
  "total": 1337,
  "hasMorePages": true,
  "from": 21,
  "to": 40
}
```

**No Text Replacement**: Pagination info is numeric, no "file" words.

---

### GamesResponse Entity

**Description**: Response wrapper for games list query.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | Array<Game> | Yes | Array of game entities |
| `paginatorInfo` | PaginatorInfo | Yes | Pagination metadata |

**Example**:
```json
{
  "data": [
    { "id": 1, "title": "Game 1", ... },
    { "id": 2, "title": "Game 2", ... }
  ],
  "paginatorInfo": {
    "currentPage": 1,
    "lastPage": 10,
    "hasMorePages": true
  }
}
```

---

### ModsResponse Entity

**Description**: Response wrapper for mods list query.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | Array<Mod> | Yes | Array of mod entities |
| `paginatorInfo` | PaginatorInfo | Yes | Pagination metadata |

**Example**:
```json
{
  "data": [
    { "id": 1, "title": "Mod 1", ... },
    { "id": 2, "title": "Mod 2", ... }
  ],
  "paginatorInfo": {
    "currentPage": 1,
    "lastPage": 5,
    "hasMorePages": true
  }
}
```

---

## Application State

### API Key State

**Storage**: localStorage (`piefiles_api_key`)

**Description**: User's GameFront API key for authenticated requests.

**Schema**:
```javascript
// localStorage.getItem('piefiles_api_key')
// Returns: String | null
{
  value: "gf_1234567890abcdef1234567890abcdef" // Example key format
}
```

**Validation**:
- Non-empty string
- Test with API call before saving
- Clear if 401 response received

**Security Notes**:
- Stored in plaintext (acceptable per constitution - client-side only)
- Never logged or sent to analytics
- User warned: "API keys are stored in your browser only. Never share your API key."

---

### Component State (Lit Reactive Properties)

#### GamesListState

**Component**: `<pie-games-list>`

**Fields**:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `games` | Array<Game> | `[]` | Current page of games |
| `loading` | Boolean | `false` | Loading state |
| `error` | Object \| null | `null` | Error object (if any) |
| `page` | Number | `1` | Current page number |
| `lastPage` | Number | `1` | Total pages |
| `searchQuery` | String | `''` | Current search term |

**State Transitions**:
1. **Initial Load**: `loading: true` → fetch → `loading: false`, `games: [...]`
2. **Search**: Update `searchQuery` → reset `page: 1` → fetch → update `games`
3. **Pagination**: Update `page` → fetch → update `games`
4. **Error**: `loading: false`, `error: { message: "..." }`

---

#### GameDetailState

**Component**: `<pie-game-detail>`

**Fields**:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `game` | Game \| null | `null` | Game entity |
| `mods` | Array<Mod> | `[]` | Mods for this game |
| `loading` | Boolean | `false` | Loading state |
| `error` | Object \| null | `null` | Error object |
| `modsPage` | Number | `1` | Current mods page |
| `modsLastPage` | Number | `1` | Total mods pages |

**State Transitions**:
1. **Initial Load**: Fetch game + first page of mods → populate `game` and `mods`
2. **Pagination**: Fetch next page of mods → append to `mods` or replace
3. **Error**: `error: { message: "Game not found" }` → show 404

---

#### ModDetailState

**Component**: `<pie-mod-detail>`

**Fields**:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mod` | Mod \| null | `null` | Mod entity |
| `loading` | Boolean | `false` | Loading state |
| `error` | Object \| null | `null` | Error object |

**State Transitions**:
1. **Initial Load**: Fetch mod by ID → populate `mod`
2. **Error**: `error: { message: "Mod not found" }` → show 404

---

#### ApiKeyModalState

**Component**: `<pie-api-key-modal>`

**Fields**:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `open` | Boolean | `false` | Modal visibility |
| `apiKey` | String | `''` | Input value |
| `validating` | Boolean | `false` | Testing API key |
| `error` | String \| null | `null` | Validation error message |

**State Transitions**:
1. **Open Modal**: `open: true`
2. **User Types**: Update `apiKey`
3. **Save**: `validating: true` → test API call → success: save to localStorage, close modal | failure: show error
4. **Cancel**: `open: false`, reset `apiKey`

---

### Router State

**Storage**: Browser History API (`window.location`)

**Description**: Current route and navigation state.

**Schema**:
```javascript
{
  pathname: "/games/age-of-mythology",  // Current path
  title: "Pie Files - Age of Mythology", // Page title
  params: { slug: "age-of-mythology" }   // Extracted route params
}
```

**State Transitions**:
1. **Navigate**: `router.navigate(path)` → `history.pushState()` → `handleRoute()`
2. **Back Button**: `popstate` event → `handleRoute()` → update UI
3. **Direct URL**: Page load → `handleRoute()` → render appropriate component
4. **Deep Link**: 404.html redirect → sessionStorage → restore path → render

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         User Action                         │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Lit Component Event                      │
│  (e.g., search input, page button click, link click)       │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Router / Component Method                  │
│     (e.g., router.navigate(), fetchGames(), etc.)          │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    GameFront API Client                     │
│  gamefrontClient.query(QUERY, variables)                   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               GraphQL Fetch (with headers)                  │
│  POST https://gamefront.com/api/v1/graphql                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
    ┌──────────────────┐    ┌──────────────────┐
    │   Success (200)  │    │  Error (4xx/5xx) │
    │  { data: {...} } │    │  { error: "..." }│
    └────────┬─────────┘    └────────┬─────────┘
             │                       │
             └───────────┬───────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Update Component Reactive Properties           │
│  this.games = result.data; this.loading = false;           │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Lit Re-renders                          │
│  render() { return html`<div>...</div>`; }                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  updated() Lifecycle Hook                   │
│  replacePieInText(this.shadowRoot);                        │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DOM Updated                            │
│  User sees "1337 pies" instead of "1337 files"            │
└─────────────────────────────────────────────────────────────┘
```

---

## GraphQL Query Examples

### Games List Query

```graphql
query Games(
  $search: String
  $orderBy: GamesOrderColumn
  $orderDirection: SortDirection
  $first: Int!
  $page: Int!
) {
  games(
    search: $search
    order_by: $orderBy
    order_direction: $orderDirection
    first: $first
    page: $page
  ) {
    data {
      id
      title
      slug
      url
      file_count
      categories {
        id
        name
        slug
      }
    }
    paginatorInfo {
      currentPage
      lastPage
      hasMorePages
      total
    }
  }
}
```

**Variables**:
```json
{
  "search": "mythology",
  "orderBy": "TITLE",
  "orderDirection": "ASC",
  "first": 20,
  "page": 1
}
```

---

### Single Game Query

```graphql
query Game($slug: String!) {
  game(slug: $slug) {
    id
    title
    slug
    url
    file_count
    description
    categories {
      id
      name
      slug
    }
    created_at
    updated_at
  }
}
```

**Variables**:
```json
{
  "slug": "age-of-mythology"
}
```

---

### Mods for Game Query

```graphql
query Mods(
  $gameSlug: String!
  $first: Int!
  $page: Int!
) {
  mods(
    game_slug: $gameSlug
    first: $first
    page: $page
  ) {
    data {
      id
      title
      slug
      description
      file_size
      download_count
      download_url
      author
      uploaded_at
      screenshots
      categories {
        id
        name
        slug
      }
    }
    paginatorInfo {
      currentPage
      lastPage
      hasMorePages
      total
    }
  }
}
```

**Variables**:
```json
{
  "gameSlug": "age-of-mythology",
  "first": 20,
  "page": 1
}
```

---

### Single Mod Query

```graphql
query Mod($id: ID!) {
  mod(id: $id) {
    id
    title
    slug
    description
    file_size
    download_count
    download_url
    author
    author_url
    uploaded_at
    updated_at
    screenshots
    categories {
      id
      name
      slug
    }
    version
    compatibility
    game {
      id
      title
      slug
    }
  }
}
```

**Variables**:
```json
{
  "id": "67890"
}
```

---

## Entity Relationships

```
Game (1) ───────────────────────── (*) Mod
  │                                    │
  │                                    │
  └──────── (*) Category (*) ──────────┘
  
Game.categories → Array<Category>
Mod.categories → Array<Category>
Mod.game → Game (optional, only when included in query)
```

**Notes**:
- Many-to-many relationship between Games and Categories
- Many-to-many relationship between Mods and Categories
- One-to-many relationship between Game and Mods
- No foreign key constraints (we don't control the database)
- Relationships are read-only (no mutations)

---

## Validation Rules

### API Key Validation
- Must be non-empty string
- Test by making a simple API call (e.g., fetch first game)
- If 401 response → invalid
- If 200 response → valid

### Search Query Validation
- Minimum length: 0 characters (empty = show all)
- Maximum length: 100 characters (reasonable limit)
- Trim whitespace before sending to API
- Debounce input: 300ms delay

### Pagination Validation
- `page` must be >= 1
- `page` must be <= `lastPage`
- `first` (per page) must be between 1-100 (default: 20)

### URL Parameter Validation
- Game slug: Must be alphanumeric + hyphens (validated by regex)
- Mod ID: Must be numeric string (validated by regex)
- If invalid, show 404 error

---

## Error Response Format

**Standardized Error Object**:

```javascript
{
  success: false,
  error: 'error_code',        // One of: network, unauthorized, rate_limit, server_error, timeout, unknown
  message: 'User-friendly message',
  retryable: true,            // Can user retry this operation?
  retryAfter: 30000           // Milliseconds to wait (for rate_limit errors)
}
```

**Error Codes**:

| Code | HTTP Status | Message | Retryable |
|------|-------------|---------|-----------|
| `network` | N/A | "Unable to reach GameFront. Please try again later." | Yes |
| `unauthorized` | 401 | "API key invalid or missing. Please configure your API key." | No (show modal) |
| `rate_limit` | 429 | "Too many requests. Please wait 30 seconds and try again." | Yes (auto-retry) |
| `server_error` | 500, 502, 503 | "GameFront is experiencing issues. Please try again later." | Yes |
| `timeout` | N/A | "Request timed out. Please check your connection." | Yes |
| `not_found` | 404 | "Game/Mod not found." | No |
| `unknown` | Other | "An unexpected error occurred." | Yes |

---

## Summary

This data model defines:
- ✅ All entities from GameFront API (Game, Mod, Category, PaginatorInfo)
- ✅ Application state (API key, component state, router state)
- ✅ Data flow from user action → API → UI update
- ✅ GraphQL query structures
- ✅ Validation rules and error handling
- ✅ Text replacement rules per entity

**Total Entity Count**: 6 API entities + 5 component states + 1 localStorage state = 12 data structures

**No Database Schema**: This is a frontend-only app with no backend storage.
