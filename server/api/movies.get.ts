import type { MovieApiResponse, SearchParams } from '~/types';

const API_BASE_URL = 'https://jsonmock.hackerrank.com/api/movies/search';

export default defineEventHandler(async event => {
  const query = getQuery(event) as SearchParams;
  const { title = '', page = 1 } = query;

  try {
    const url = new URL(API_BASE_URL);

    if (title) {
      url.searchParams.append('Title', title.toString());
    }

    url.searchParams.append('page', page.toString());

    const response = await $fetch<MovieApiResponse>(url.toString());

    return {
      success: true,
      data: {
        ...response,
        data: response.data.map(movie => ({
          id: movie.id,
          title: movie.Title,
          year: movie.Year,
          imdbID: movie.imdbID
        }))
      }
    };
  } catch (error) {
    console.error('API Error:', error);

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch movies from the API'
    });
  }
});
