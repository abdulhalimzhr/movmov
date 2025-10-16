import { defineStore } from 'pinia';
import type { Movie, FavoriteMovie } from '~/types';

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<FavoriteMovie[]>([]);
  const favoriteCount = computed(() => favorites.value.length);

  const isFavorited = (movie: Movie): boolean => {
    return favorites.value.some((fav) => fav.imdbID === movie.imdbID);
  };

  const getFavoriteByImdbId = (
    imdbID: string
  ): FavoriteMovie | undefined => {
    return favorites.value.find((fav) => fav.imdbID === imdbID);
  };

  const sortedFavorites = computed<FavoriteMovie[]>(() => {
    return [...favorites.value].sort(
      (a, b) =>
        new Date(b.favoritedAt).getTime() -
        new Date(a.favoritedAt).getTime()
    );
  });

  const loadFavorites = () => {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem('movie-favorites');
        if (stored) {
          favorites.value = JSON.parse(stored);
        }
      } catch (error) {
        console.error(
          'Failed to load favorites from localStorage:',
          error
        );
        favorites.value = [];
      }
    }
  };

  const saveFavorites = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem(
          'movie-favorites',
          JSON.stringify(favorites.value)
        );
      } catch (error) {
        console.error(
          'Failed to save favorites to localStorage:',
          error
        );
      }
    }
  };

  const addToFavorites = (movie: Movie) => {
    if (!isFavorited(movie)) {
      const favoriteMovie: FavoriteMovie = {
        ...movie,
        favoritedAt: new Date().toISOString()
      };
      favorites.value.push(favoriteMovie);
      saveFavorites();
    }
  };

  const removeFromFavorites = (movie: Movie) => {
    const index = favorites.value.findIndex(
      (fav) => fav.imdbID === movie.imdbID
    );
    if (index > -1) {
      favorites.value.splice(index, 1);
      saveFavorites();
    }
  };

  const toggleFavorite = (movie: Movie) => {
    if (isFavorited(movie)) {
      removeFromFavorites(movie);
    } else {
      addToFavorites(movie);
    }
  };

  const clearFavorites = () => {
    favorites.value = [];
    saveFavorites();
  };

  if (import.meta.client) {
    onMounted(() => {
      loadFavorites();
    });
  }

  return {
    favorites: readonly(favorites),
    favoriteCount,
    sortedFavorites,
    isFavorited,
    getFavoriteByImdbId,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
    loadFavorites,
    saveFavorites
  };
});
