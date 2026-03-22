/**
 * GraphQL query strings for GameFront API
 * @module queries
 */

export const GAMES_QUERY = `
  query Games($search: String, $orderBy: GamesOrderColumn, $orderDirection: SortDirection, $first: Int!, $page: Int!) {
    games(search: $search, order_by: $orderBy, order_direction: $orderDirection, first: $first, page: $page) {
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
      }
    }
  }
`

export const GAME_QUERY = `
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
    }
  }
`

export const MODS_QUERY = `
  query ModsForGame($slug: String!, $first: Int!, $page: Int!) {
    modsForGame(game_slug: $slug, first: $first, page: $page) {
      data {
        id
        title
        slug
        description
        downloads
        created_at
        updated_at
        author {
          display_name
          slug
        }
      }
      paginatorInfo {
        currentPage
        lastPage
        hasMorePages
      }
    }
  }
`

export const MOD_QUERY = `
  query Mod($slug: String!, $gameSlug: String!) {
    mod(slug: $slug, game_slug: $gameSlug) {
      id
      title
      slug
      url
      description
      excerpt
      downloads
      created_at
      updated_at
      author {
        display_name
        slug
      }
      game {
        id
        title
        slug
      }
      images {
        id
        path
        size
      }
    }
  }
`
