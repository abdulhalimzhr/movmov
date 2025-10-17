import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useMovies } from '~/composables/useMovies';
import { useMoviesStore } from '~/stores/movies';
import type { Movie, SearchParams } from '~/types';

const fetchMock = vi.fn();

const createMockMovie = (overrides: Partial<Movie> = {}): Movie => ({
  id: 1,
  title: 'Test Movie',
  year: 2023,
  imdbID: 'tt1234567',
  ...overrides
});

describe('useMovies composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    vi.stubGlobal('$fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('provides reactive state from movies store', () => {
    const moviesStore = useMoviesStore();
    const moviesComposable = useMovies();

    expect(moviesComposable.loading).toBeDefined();
    expect(moviesComposable.error).toBeDefined();
    expect(moviesComposable.movies).toBeDefined();
    expect(moviesComposable.totalPages).toBeDefined();
    expect(moviesComposable.currentPage).toBeDefined();
    expect(moviesComposable.totalMovies).toBeDefined();
    expect(moviesComposable.currentMovie).toBeDefined();
    expect(moviesComposable.lastParams).toBeDefined();
  });

  it('provides methods from movies store', () => {
    const moviesComposable = useMovies();

    expect(moviesComposable.fetchMovies).toBeDefined();
    expect(moviesComposable.searchMovies).toBeDefined();
    expect(moviesComposable.loadPage).toBeDefined();
  });

  it('searchMovies calls fetchMovies with correct parameters', async () => {
    const moviesStore = useMoviesStore();
    const fetchMoviesSpy = vi.spyOn(moviesStore, 'fetchMovies');
    const moviesComposable = useMovies();

    fetchMock.mockResolvedValue({
      success: true,
      data: {
        data: [],
        total: 0,
        total_pages: 0,
        per_page: 10,
        page: 1
      }
    });

    await moviesComposable.searchMovies('Action Movies', 2);

    expect(fetchMoviesSpy).toHaveBeenCalledWith({
      title: 'Action Movies',
      page: 2
    });
  });

  it('searchMovies uses default page 1 when not specified', async () => {
    const moviesStore = useMoviesStore();
    const fetchMoviesSpy = vi.spyOn(moviesStore, 'fetchMovies');
    const moviesComposable = useMovies();

    fetchMock.mockResolvedValue({
      success: true,
      data: {
        data: [],
        total: 0,
        total_pages: 0,
        per_page: 10,
        page: 1
      }
    });

    await moviesComposable.searchMovies('Drama');

    expect(fetchMoviesSpy).toHaveBeenCalledWith({
      title: 'Drama',
      page: 1
    });
  });

  it('loadPage calls fetchMovies with lastParams and new page', async () => {
    const moviesStore = useMoviesStore();
    const fetchMoviesSpy = vi.spyOn(moviesStore, 'fetchMovies');
    const moviesComposable = useMovies();

    moviesStore.lastParams = { title: 'Comedy', page: 1 };

    fetchMock.mockResolvedValue({
      success: true,
      data: {
        data: [],
        total: 0,
        total_pages: 0,
        per_page: 10,
        page: 1
      }
    });

    await moviesComposable.loadPage(3);

    expect(fetchMoviesSpy).toHaveBeenCalledWith({
      title: 'Comedy',
      page: 3
    });
  });

  it('fetchMovies directly calls store fetchMovies', async () => {
    const moviesStore = useMoviesStore();
    const storeFetchSpy = vi.spyOn(moviesStore, 'fetchMovies');
    const moviesComposable = useMovies();

    fetchMock.mockResolvedValue({
      success: true,
      data: {
        data: [],
        total: 0,
        total_pages: 0,
        per_page: 10,
        page: 1
      }
    });

    const params: SearchParams = { title: 'Sci-Fi', page: 1 };
    await moviesComposable.fetchMovies(params);

    expect(storeFetchSpy).toHaveBeenCalledWith(params);
  });

  it('exposes reactive state that updates when store changes', async () => {
    const moviesStore = useMoviesStore();
    const moviesComposable = useMovies();

    expect(moviesComposable.movies.value).toEqual([]);
    expect(moviesComposable.loading.value).toBe(false);

    const mockMovie = createMockMovie();
    moviesStore.movies = [mockMovie];
    moviesStore.loading = true;

    expect(moviesComposable.movies.value).toEqual([mockMovie]);
    expect(moviesComposable.loading.value).toBe(true);
  });

  it('provides currentMovie from store', async () => {
    const moviesStore = useMoviesStore();
    const moviesComposable = useMovies();

    expect(moviesComposable.currentMovie.value).toBeNull();

    const mockMovie = createMockMovie();
    moviesStore.currentMovie = mockMovie;

    expect(moviesComposable.currentMovie.value).toEqual(mockMovie);
  });

  it('provides pagination state from store', async () => {
    const moviesStore = useMoviesStore();
    const moviesComposable = useMovies();

    moviesStore.totalPages = 10;
    moviesStore.currentPage = 3;
    moviesStore.totalMovies = 250;

    expect(moviesComposable.totalPages.value).toBe(10);
    expect(moviesComposable.currentPage.value).toBe(3);
    expect(moviesComposable.totalMovies.value).toBe(250);
  });

  it('provides error state from store', async () => {
    const moviesStore = useMoviesStore();
    const moviesComposable = useMovies();

    expect(moviesComposable.error.value).toBeNull();

    moviesStore.error = 'Network error occurred';

    expect(moviesComposable.error.value).toBe('Network error occurred');
  });

  it('exposes lastParams from store', async () => {
    const moviesStore = useMoviesStore();
    const moviesComposable = useMovies();

    expect(moviesComposable.lastParams.value).toEqual({ title: '', page: 1 });

    const params: SearchParams = { title: 'Horror', page: 2 };
    moviesStore.lastParams = {
      title: params.title || '',
      page: params.page || 1
    };

    expect(moviesComposable.lastParams.value).toEqual(params);
  });

  it('loadPage works when lastParams has defaults', async () => {
    const moviesStore = useMoviesStore();
    const fetchMoviesSpy = vi.spyOn(moviesStore, 'fetchMovies');
    const moviesComposable = useMovies();

    fetchMock.mockResolvedValue({
      success: true,
      data: {
        data: [],
        total: 0,
        total_pages: 0,
        per_page: 10,
        page: 1
      }
    });

    await moviesComposable.loadPage(5);

    expect(fetchMoviesSpy).toHaveBeenCalledWith({
      title: '',
      page: 5
    });
  });

  it('maintains reference to same store instance', () => {
    const moviesComposable1 = useMovies();
    const moviesComposable2 = useMovies();

    expect(moviesComposable1.loading.value).toBe(
      moviesComposable2.loading.value
    );
    expect(moviesComposable1.movies.value).toBe(moviesComposable2.movies.value);
  });

  it('handles empty search parameters', async () => {
    const moviesStore = useMoviesStore();
    const fetchMoviesSpy = vi.spyOn(moviesStore, 'fetchMovies');
    const moviesComposable = useMovies();

    fetchMock.mockResolvedValue({
      success: true,
      data: {
        data: [],
        total: 0,
        total_pages: 0,
        per_page: 10,
        page: 1
      }
    });

    await moviesComposable.searchMovies('');

    expect(fetchMoviesSpy).toHaveBeenCalledWith({
      title: '',
      page: 1
    });
  });

  it('loadPage merges page with existing lastParams', async () => {
    const moviesStore = useMoviesStore();
    const fetchMoviesSpy = vi.spyOn(moviesStore, 'fetchMovies');
    const moviesComposable = useMovies();

    moviesStore.lastParams = { title: 'Thriller', page: 2 };

    fetchMock.mockResolvedValue({
      success: true,
      data: {
        data: [],
        total: 0,
        total_pages: 0,
        per_page: 10,
        page: 1
      }
    });

    await moviesComposable.loadPage(4);

    expect(fetchMoviesSpy).toHaveBeenCalledWith({
      title: 'Thriller',
      page: 4
    });
  });
});
