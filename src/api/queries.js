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
  query Game($slug: String!, $first: Int, $page: Int) {
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
      files(first: $first, page: $page) {
        data {
          id
          title
          slug
          description
          file_size
          download_count
          created_at
          updated_at
          author {
            id
            name
          }
        }
        paginatorInfo {
          currentPage
          lastPage
          hasMorePages
        }
      }
    }
  }
`

export const MODS_QUERY = `
  query Files($gameSlug: String!, $first: Int!, $page: Int!) {
    files(game_slug: $gameSlug, first: $first, page: $page) {
      data {
        id
        title
        slug
        description
        file_size
        download_count
        created_at
        updated_at
        author {
          id
          name
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
  query File($id: ID!) {
    file(id: $id) {
      id
      title
      slug
      description
      file_size
      download_count
      download_url
      created_at
      updated_at
      author {
        id
        name
      }
      game {
        id
        title
        slug
      }
      screenshots {
        id
        url
        thumbnail_url
      }
    }
  }
`
