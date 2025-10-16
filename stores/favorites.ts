import { defineStore } from 'pinia';
import { computed, getCurrentInstance, onMounted, ref } from 'vue';
import type { Movie, FavoriteMovie } from '~/types';

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<FavoriteMovie[]>([]);
  const favoriteCount = computed(() => favorites.value.length);

  const isFavorited = (movie: Movie): boolean => {
    return favorites.value.some(fav => fav.imdbID === movie.imdbID);
  };

  const getFavoriteByImdbId = (imdbID: string): FavoriteMovie | undefined => {
    return favorites.value.find(fav => fav.imdbID === imdbID);
  };

  const sortedFavorites = computed<FavoriteMovie[]>(() => {
    return [...favorites.value].sort(
      (a, b) =>
        new Date(b.favoritedAt).getTime() - new Date(a.favoritedAt).getTime()
    );
  });

  const loadFavorites = () => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const stored = window.localStorage.getItem('movie-favorites');
      if (stored) {
        favorites.value = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
      favorites.value = [];
    }
  };

  const saveFavorites = () => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(
        'movie-favorites',
        JSON.stringify(favorites.value)
      );
    } catch (error) {
      console.error('Failed to save favorites to localStorage:', error);
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
    const index = favorites.value.findIndex(fav => fav.imdbID === movie.imdbID);
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

  if (typeof window !== 'undefined') {
    const instance = getCurrentInstance();
    if (instance) {
      onMounted(() => {
        loadFavorites();
      });
    } else {
      loadFavorites();
    }
  }

  return {
    favorites,
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
