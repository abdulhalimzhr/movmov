import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Movie, MoviesResponse, SearchParams } from '~/types';

type NormalizedSearchParams = {
  title: string;
  page: number;
};

const buildCacheKey = (params: NormalizedSearchParams) => {
  const title = params.title.trim().toLowerCase();
  const page = params.page;
  return `${title}::${page}`;
};

export const useMoviesStore = defineStore('movies', () => {
  const movies = ref<Movie[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const totalPages = ref(0);
  const currentPage = ref(1);
  const totalMovies = ref(0);
  const lastParams = ref<NormalizedSearchParams>({
    title: '',
    page: 1
  });

  const listCache = ref<Record<string, MoviesResponse>>({});
  const movieCache = ref<Record<string, Movie>>({});
  const currentMovie = ref<Movie | null>(null);

  const fetchMovies = async (params: SearchParams = {}) => {
    const normalizedParams: NormalizedSearchParams = {
      title: params.title ?? '',
      page: params.page ?? 1
    };

    lastParams.value = normalizedParams;

    const cacheKey = buildCacheKey(normalizedParams);

    const cached = listCache.value[cacheKey];

    if (cached) {
      movies.value = cached.data;
      totalPages.value = cached.total_pages;
      totalMovies.value = cached.total;
      currentPage.value = cached.page;
      return cached;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<{
        success: boolean;
        data: MoviesResponse;
      }>('/api/movies', {
        query: normalizedParams
      });

      const payload = response.data;

      movies.value = payload.data;
      totalPages.value = payload.total_pages;
      totalMovies.value = payload.total;
      currentPage.value = payload.page;
      listCache.value[cacheKey] = payload;

      payload.data.forEach(movie => {
        movieCache.value[movie.imdbID] = movie;
      });

      return payload;
    } catch (err) {
      console.error('Failed to fetch movies:', err);
      const message =
        err instanceof Error ? err.message : 'Failed to fetch movies';
      error.value = message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const refreshLastQuery = async () => {
    if (!lastParams.value) {
      return;
    }

    const cacheKey = buildCacheKey(lastParams.value);
    delete listCache.value[cacheKey];
    await fetchMovies(lastParams.value);
  };

  const setCurrentMovie = (movie: Movie) => {
    currentMovie.value = movie;
    movieCache.value[movie.imdbID] = movie;
  };

  const getMovieFromCache = (imdbID: string) => {
    return movieCache.value[imdbID] ?? null;
  };

  const clearCurrentMovie = () => {
    currentMovie.value = null;
  };

  return {
    movies,
    loading,
    error,
    totalPages,
    currentPage,
    totalMovies,
    currentMovie,
    lastParams,
    fetchMovies,
    refreshLastQuery,
    setCurrentMovie,
    getMovieFromCache,
    clearCurrentMovie
  };
});
