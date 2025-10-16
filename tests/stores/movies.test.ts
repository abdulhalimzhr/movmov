import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useMoviesStore } from '~/stores/movies';
import type { Movie, MoviesResponse } from '~/types';

const createMovie = (overrides: Partial<Movie> = {}): Movie => ({
  id: 1,
  title: 'Test Movie',
  year: 2023,
  imdbID: 'tt1234567',
  ...overrides
});

const createResponse = (movies: Movie[]): MoviesResponse => ({
  page: 1,
  per_page: movies.length,
  total: movies.length,
  total_pages: 1,
  data: movies
});

describe('useMoviesStore', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('$fetch', fetchMock);
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches movies and updates state', async () => {
    const movie = createMovie();
    const response = {
      success: true,
      data: createResponse([movie])
    };
    fetchMock.mockResolvedValue(response);

    const store = useMoviesStore();
    const result = await store.fetchMovies({ title: 'Test', page: 2 });

    expect(fetchMock).toHaveBeenCalledWith('/api/movies', {
      query: { title: 'Test', page: 2 }
    });
    expect(result).toEqual(response.data);
    expect(store.movies).toEqual([movie]);
    expect(store.totalPages).toBe(1);
    expect(store.totalMovies).toBe(1);
    expect(store.currentPage).toBe(1);
    expect(store.error).toBeNull();
    expect(store.loading).toBe(false);
  });

  it('uses cached response for identical queries', async () => {
    const movie = createMovie();
    const response = {
      success: true,
      data: createResponse([movie])
    };
    fetchMock.mockResolvedValue(response);

    const store = useMoviesStore();
    await store.fetchMovies({ title: 'Cache', page: 1 });
    fetchMock.mockClear();

    const cachedResult = await store.fetchMovies({ title: 'Cache', page: 1 });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(cachedResult).toEqual(response.data);
    expect(store.movies).toEqual([movie]);
  });

  it('refreshes last query and bypasses cache', async () => {
    const firstMovie = createMovie({ imdbID: 'tt1111111' });
    const secondMovie = createMovie({ imdbID: 'tt2222222', title: 'Updated' });

    fetchMock.mockResolvedValueOnce({
      success: true,
      data: createResponse([firstMovie])
    });

    const store = useMoviesStore();
    await store.fetchMovies({ title: 'Refresh', page: 1 });

    fetchMock.mockResolvedValueOnce({
      success: true,
      data: createResponse([secondMovie])
    });

    await store.refreshLastQuery();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(store.movies).toEqual([secondMovie]);
    expect(store.lastParams).toEqual({ title: 'Refresh', page: 1 });
  });

  it('stores and retrieves movie details from cache', () => {
    const movie = createMovie({ imdbID: 'tt9999999' });
    const store = useMoviesStore();

    expect(store.getMovieFromCache(movie.imdbID)).toBeNull();

    store.setCurrentMovie(movie);

    expect(store.currentMovie).toEqual(movie);
    expect(store.getMovieFromCache(movie.imdbID)).toEqual(movie);

    store.clearCurrentMovie();
    expect(store.currentMovie).toBeNull();
  });

  it('sets error state when fetch fails', async () => {
    const error = new Error('Network failure');
    fetchMock.mockRejectedValue(error);

    const store = useMoviesStore();

    await expect(store.fetchMovies({ title: 'Error' })).rejects.toThrow(
      'Network failure'
    );

    expect(store.error).toBe('Network failure');
    expect(store.loading).toBe(false);
  });
});
