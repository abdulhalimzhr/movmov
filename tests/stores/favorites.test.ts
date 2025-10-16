import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useFavoritesStore } from '~/stores/favorites';
import type { Movie } from '~/types';

const mockMovie = (overrides: Partial<Movie> = {}): Movie => ({
  id: 1,
  title: 'Waterworld',
  year: 1995,
  imdbID: 'tt0114898',
  ...overrides
});

describe('useFavoritesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorage.getItem.mockReset();
    localStorage.setItem.mockReset();
    localStorage.removeItem.mockReset();
    localStorage.clear.mockReset();
    localStorage.getItem.mockReturnValue(null);
  });

  it('adds movie to favorites and persists to localStorage', () => {
    const store = useFavoritesStore();
    const movie = mockMovie();

    store.addToFavorites(movie);

    expect(store.favorites).toHaveLength(1);
    expect(store.favorites[0]).toMatchObject({ ...movie });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'movie-favorites',
      expect.stringContaining(movie.imdbID)
    );
  });

  it('removes movie from favorites', () => {
    const store = useFavoritesStore();
    const movie = mockMovie();

    store.addToFavorites(movie);
    expect(store.isFavorited(movie)).toBe(true);

    store.removeFromFavorites(movie);

    expect(store.isFavorited(movie)).toBe(false);
    expect(store.favorites).toHaveLength(0);
  });

  it('toggles favorite state', () => {
    const store = useFavoritesStore();
    const movie = mockMovie();

    store.toggleFavorite(movie);
    expect(store.isFavorited(movie)).toBe(true);

    store.toggleFavorite(movie);
    expect(store.isFavorited(movie)).toBe(false);
  });

  it('prevents duplicate favorites', () => {
    const store = useFavoritesStore();
    const movie = mockMovie();

    store.addToFavorites(movie);
    store.addToFavorites(movie);

    expect(store.favorites).toHaveLength(1);
  });

  it('loads favorites from localStorage', () => {
    const store = useFavoritesStore();
    const movie = mockMovie();
    const stored = [
      {
        ...movie,
        favoritedAt: '2024-01-01T00:00:00.000Z'
      }
    ];

    localStorage.getItem.mockReturnValue(JSON.stringify(stored));
    store.loadFavorites();

    expect(store.favorites).toEqual(stored);
  });

  it('clears favorites and resets count', () => {
    const store = useFavoritesStore();
    const movie = mockMovie();

    store.addToFavorites(movie);
    expect(store.favoriteCount).toBe(1);

    store.clearFavorites();

    expect(store.favorites).toHaveLength(0);
    expect(store.favoriteCount).toBe(0);
  });

  it('returns sorted favorites by favoritedAt descending', () => {
    const store = useFavoritesStore();
    const movieA = mockMovie({ imdbID: 'tt1', title: 'A' });
    const movieB = mockMovie({ imdbID: 'tt2', title: 'B' });

    vi.useFakeTimers();

    // Force timestamps for deterministic order
    const firstTimestamp = '2024-01-01T00:00:00.000Z';
    const secondTimestamp = '2024-01-02T00:00:00.000Z';

    vi.setSystemTime(new Date(firstTimestamp));
    store.addToFavorites(movieA);

    vi.setSystemTime(new Date(secondTimestamp));
    store.addToFavorites(movieB);

    const sorted = store.sortedFavorites;
    expect(store.favorites.map(item => item.imdbID)).toEqual(['tt1', 'tt2']);
    expect(sorted[0].imdbID).toBe('tt2');
    expect(sorted[1].imdbID).toBe('tt1');

    vi.useRealTimers();
  });
});
