# GameFront GraphQL API Contract

**Version**: 1.0  
**Base URL**: `https://www.gamefront.com/api/v1/graphql`  
**Protocol**: GraphQL over HTTP POST  
**Authentication**: Bearer token in Authorization header  

---

## Authentication

### Required Headers

```http
POST /api/v1/graphql HTTP/1.1
Host: www.gamefront.com
Content-Type: application/json
Accept: application/json
Authorization: Bearer {USER_API_KEY}
User-Agent: PieFiles/1.0 (+https://piefiles.com)
```

**Notes**:
- API key obtained from https://www.gamefront.com/account/api-keys
- User-Agent is required per GameFront API ToS
- Missing Authorization header → 401 Unauthorized

---

## Rate Limits

| Authentication | Rate Limit | Window |
|----------------|------------|--------|
| With valid token | 120 requests | 1 minute |
| Without token | 30 requests | 1 minute |

**Rate Limit Headers** (if provided):
- `X-RateLimit-Limit`: Maximum requests per window
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Unix timestamp when window resets

**429 Response** (Rate Limit Exceeded):
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again in 30 seconds.",
  "retry_after": 30
}
```

---

## Query 1: List Games

**Operation Name**: `Games`

**Purpose**: Fetch paginated list of games with optional search and sorting.

**GraphQL Query**:
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
      perPage
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

**Variable Types**:
- `search` (String, optional): Search query to filter games by title
- `orderBy` (GamesOrderColumn, optional): Column to sort by
  - Allowed values: `TITLE`, `FILE_COUNT`, `CREATED_AT`, `UPDATED_AT`
  - Default: `TITLE`
- `orderDirection` (SortDirection, optional): Sort direction
  - Allowed values: `ASC`, `DESC`
  - Default: `ASC`
- `first` (Int, required): Number of items per page
  - Min: 1, Max: 100
  - Default: 20
- `page` (Int, required): Page number (1-indexed)
  - Min: 1

**Success Response** (200 OK):
```json
{
  "data": {
    "games": {
      "data": [
        {
          "id": 12345,
          "title": "Age of Mythology",
          "slug": "age-of-mythology",
          "url": "https://www.gamefront.com/games/age-of-mythology",
          "file_count": 1337,
          "categories": [
            {
              "id": 1,
              "name": "Strategy",
              "slug": "strategy"
            },
            {
              "id": 2,
              "name": "RTS",
              "slug": "rts"
            }
          ]
        }
      ],
      "paginatorInfo": {
        "currentPage": 1,
        "lastPage": 67,
        "hasMorePages": true,
        "total": 1337,
        "perPage": 20
      }
    }
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "errors": [
    {
      "message": "Unauthenticated.",
      "extensions": {
        "category": "authentication"
      }
    }
  ]
}
```

**Empty Results**:
```json
{
  "data": {
    "games": {
      "data": [],
      "paginatorInfo": {
        "currentPage": 1,
        "lastPage": 1,
        "hasMorePages": false,
        "total": 0,
        "perPage": 20
      }
    }
  }
}
```

---

## Query 2: Get Single Game

**Operation Name**: `Game`

**Purpose**: Fetch detailed information about a specific game by slug.

**GraphQL Query**:
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

**Variable Types**:
- `slug` (String, required): URL-friendly game identifier

**Success Response** (200 OK):
```json
{
  "data": {
    "game": {
      "id": 12345,
      "title": "Age of Mythology",
      "slug": "age-of-mythology",
      "url": "https://www.gamefront.com/games/age-of-mythology",
      "file_count": 1337,
      "description": "Epic real-time strategy game featuring mythological units and gods.",
      "categories": [
        {
          "id": 1,
          "name": "Strategy",
          "slug": "strategy"
        }
      ],
      "created_at": "2023-01-15T10:30:00Z",
      "updated_at": "2026-03-20T14:22:00Z"
    }
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "errors": [
    {
      "message": "Game not found",
      "extensions": {
        "category": "not_found"
      }
    }
  ],
  "data": {
    "game": null
  }
}
```

---

## Query 3: List Mods for Game

**Operation Name**: `Mods`

**Purpose**: Fetch paginated list of mods for a specific game.

**GraphQL Query**:
```graphql
query Mods(
  $gameSlug: String!
  $orderBy: ModsOrderColumn
  $orderDirection: SortDirection
  $first: Int!
  $page: Int!
) {
  mods(
    game_slug: $gameSlug
    order_by: $orderBy
    order_direction: $orderDirection
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
      perPage
    }
  }
}
```

**Variables**:
```json
{
  "gameSlug": "age-of-mythology",
  "orderBy": "DOWNLOAD_COUNT",
  "orderDirection": "DESC",
  "first": 20,
  "page": 1
}
```

**Variable Types**:
- `gameSlug` (String, required): Game slug to filter mods
- `orderBy` (ModsOrderColumn, optional): Column to sort by
  - Allowed values: `TITLE`, `DOWNLOAD_COUNT`, `UPLOADED_AT`, `FILE_SIZE`
  - Default: `UPLOADED_AT`
- `orderDirection` (SortDirection, optional): Sort direction
  - Allowed values: `ASC`, `DESC`
  - Default: `DESC`
- `first` (Int, required): Items per page (1-100)
- `page` (Int, required): Page number (1-indexed)

**Success Response** (200 OK):
```json
{
  "data": {
    "mods": {
      "data": [
        {
          "id": 67890,
          "title": "Epic Battle Map v2",
          "slug": "epic-battle-map-v2",
          "description": "A custom map file for multiplayer battles. This file includes new terrain and objectives.",
          "file_size": 5242880,
          "download_count": 12500,
          "download_url": "https://www.gamefront.com/files/67890/download",
          "author": "ModMaster99",
          "uploaded_at": "2025-11-10T08:15:00Z",
          "screenshots": [
            "https://cdn.gamefront.com/screenshots/67890-1.jpg",
            "https://cdn.gamefront.com/screenshots/67890-2.jpg"
          ],
          "categories": [
            {
              "id": 10,
              "name": "Maps",
              "slug": "maps"
            }
          ]
        }
      ],
      "paginatorInfo": {
        "currentPage": 1,
        "lastPage": 45,
        "hasMorePages": true,
        "total": 892,
        "perPage": 20
      }
    }
  }
}
```

**Empty Results** (Game has no mods):
```json
{
  "data": {
    "mods": {
      "data": [],
      "paginatorInfo": {
        "currentPage": 1,
        "lastPage": 1,
        "hasMorePages": false,
        "total": 0,
        "perPage": 20
      }
    }
  }
}
```

---

## Query 4: Get Single Mod

**Operation Name**: `Mod`

**Purpose**: Fetch detailed information about a specific mod by ID.

**GraphQL Query**:
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
      url
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

**Variable Types**:
- `id` (ID, required): Mod ID (can be string or integer)

**Success Response** (200 OK):
```json
{
  "data": {
    "mod": {
      "id": 67890,
      "title": "Epic Battle Map v2",
      "slug": "epic-battle-map-v2",
      "description": "<p>A custom map file for multiplayer battles.</p><p>Features:</p><ul><li>New terrain</li><li>Custom objectives</li></ul>",
      "file_size": 5242880,
      "download_count": 12500,
      "download_url": "https://www.gamefront.com/files/67890/download",
      "author": "ModMaster99",
      "author_url": "https://www.gamefront.com/users/modmaster99",
      "uploaded_at": "2025-11-10T08:15:00Z",
      "updated_at": "2025-12-01T10:00:00Z",
      "screenshots": [
        "https://cdn.gamefront.com/screenshots/67890-1.jpg",
        "https://cdn.gamefront.com/screenshots/67890-2.jpg",
        "https://cdn.gamefront.com/screenshots/67890-3.jpg"
      ],
      "categories": [
        {
          "id": 10,
          "name": "Maps",
          "slug": "maps"
        }
      ],
      "version": "2.0",
      "compatibility": "Game version 1.0+",
      "game": {
        "id": 12345,
        "title": "Age of Mythology",
        "slug": "age-of-mythology",
        "url": "https://www.gamefront.com/games/age-of-mythology"
      }
    }
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "errors": [
    {
      "message": "Mod not found",
      "extensions": {
        "category": "not_found"
      }
    }
  ],
  "data": {
    "mod": null
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Status | Meaning | PieFiles Action |
|--------|---------|-----------------|
| 200 | Success | Parse data, render UI |
| 400 | Bad Request | Show error message |
| 401 | Unauthorized | Show API key modal |
| 429 | Too Many Requests | Wait 30s, retry automatically |
| 500 | Internal Server Error | Show error, allow retry |
| 502/503 | Bad Gateway / Service Unavailable | Show "GameFront is down" message |

### GraphQL Error Response Format

```json
{
  "errors": [
    {
      "message": "Error description",
      "extensions": {
        "category": "error_type",
        "code": "ERROR_CODE"
      },
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["games", "data", 0]
    }
  ],
  "data": null
}
```

**Error Categories**:
- `authentication`: Invalid or missing API key (401)
- `validation`: Invalid query parameters (400)
- `not_found`: Resource not found (404)
- `rate_limit`: Too many requests (429)
- `internal`: Server error (500)

---

## Network Timeout

**Timeout**: 10 seconds per request

**Timeout Handling**:
```javascript
const response = await fetch(endpoint, {
  signal: AbortSignal.timeout(10000),
  // ... other options
});
```

**Timeout Error**:
```javascript
{
  success: false,
  error: 'timeout',
  message: 'Request timed out. Please check your connection.',
  retryable: true
}
```

---

## Caching Strategy

**PieFiles Approach**: No client-side caching (always fetch fresh data)

**Rationale**:
- Per constitution: "Don't store/cache API data (always fetch fresh from GameFront)"
- Simple implementation (no cache invalidation logic)
- Ensures users always see latest data
- GameFront may provide cache headers (respect them if present)

**Cache-Control Headers** (if provided by GameFront):
```http
Cache-Control: max-age=300, public
ETag: "abc123def456"
```

If GameFront provides ETags, we could implement conditional requests in Phase 2 (future enhancement).

---

## Data Types Reference

### Scalars

| Type | GraphQL | JavaScript | Description |
|------|---------|------------|-------------|
| ID | ID | String or Number | Unique identifier |
| String | String | String | Text data |
| Int | Int | Number | 32-bit integer |
| Boolean | Boolean | Boolean | true/false |
| DateTime | String | String | ISO 8601 timestamp |

### Enums

**GamesOrderColumn**:
- `TITLE`: Sort by game title
- `FILE_COUNT`: Sort by number of files
- `CREATED_AT`: Sort by creation date
- `UPDATED_AT`: Sort by last update date

**ModsOrderColumn**:
- `TITLE`: Sort by mod title
- `DOWNLOAD_COUNT`: Sort by downloads
- `UPLOADED_AT`: Sort by upload date
- `FILE_SIZE`: Sort by file size

**SortDirection**:
- `ASC`: Ascending (A-Z, 0-9, oldest-newest)
- `DESC`: Descending (Z-A, 9-0, newest-oldest)

---

## Request/Response Examples

### Example 1: Search for "mythology" games

**Request**:
```http
POST /api/v1/graphql HTTP/1.1
Host: www.gamefront.com
Content-Type: application/json
Authorization: Bearer gf_abc123def456
User-Agent: PieFiles/1.0 (+https://piefiles.com)

{
  "query": "query Games($search: String, $first: Int!, $page: Int!) { games(search: $search, first: $first, page: $page) { data { id title slug file_count } paginatorInfo { currentPage lastPage hasMorePages } } }",
  "variables": {
    "search": "mythology",
    "first": 20,
    "page": 1
  }
}
```

**Response**:
```json
{
  "data": {
    "games": {
      "data": [
        {
          "id": 12345,
          "title": "Age of Mythology",
          "slug": "age-of-mythology",
          "file_count": 1337
        },
        {
          "id": 67890,
          "title": "Mythology Wars",
          "slug": "mythology-wars",
          "file_count": 42
        }
      ],
      "paginatorInfo": {
        "currentPage": 1,
        "lastPage": 1,
        "hasMorePages": false
      }
    }
  }
}
```

---

### Example 2: Unauthorized request (missing API key)

**Request**:
```http
POST /api/v1/graphql HTTP/1.1
Host: www.gamefront.com
Content-Type: application/json
User-Agent: PieFiles/1.0 (+https://piefiles.com)

{
  "query": "query Games($first: Int!, $page: Int!) { games(first: $first, page: $page) { data { id title } } }",
  "variables": {
    "first": 20,
    "page": 1
  }
}
```

**Response** (401):
```json
{
  "errors": [
    {
      "message": "Unauthenticated.",
      "extensions": {
        "category": "authentication"
      }
    }
  ]
}
```

---

### Example 3: Rate limit exceeded

**Response** (429):
```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1678886460
Retry-After: 30

{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again in 30 seconds.",
  "retry_after": 30
}
```

---

## Testing the API

### Test Query (Health Check)

```graphql
query HealthCheck {
  games(first: 1, page: 1) {
    data {
      id
      title
    }
  }
}
```

**Purpose**: Validate API key is working

**Expected**: 200 OK with at least 1 game (or empty array if no games exist)

---

## Notes

1. **API Documentation**: This contract is based on typical GraphQL API patterns. Actual GameFront API may differ. Verify with their official documentation at https://www.gamefront.com/api-docs (if available).

2. **Field Availability**: Some fields (e.g., `description`, `screenshots`, `version`) may be null or missing for certain games/mods. Always check for null before displaying.

3. **HTML in Descriptions**: Mod descriptions may contain HTML (e.g., `<p>`, `<ul>`, `<li>`). Use Lit's `unsafeHTML` directive or sanitize before rendering.

4. **URL Formats**: All URLs returned by API are absolute (e.g., `https://www.gamefront.com/...`). Do not modify these URLs.

5. **Download URLs**: Download URLs point directly to GameFront. Clicking them should download the file (not redirect to PieFiles).

6. **Screenshot URLs**: Screenshot URLs are CDN links. Use `loading="lazy"` attribute for performance.

7. **Timestamps**: All timestamps are in ISO 8601 format (e.g., `2025-11-10T08:15:00Z`). Display in user's local timezone.

8. **Text Replacement**: Apply "file" → "pie" replacement to API responses on the client side. Do NOT send modified data back to GameFront.

---

**Version History**:
- v1.0 (2026-03-22): Initial contract based on feature specification
