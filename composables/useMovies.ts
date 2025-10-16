import { storeToRefs } from 'pinia';
import { useMoviesStore } from '~/stores/movies';
import type { SearchParams } from '~/types';

export const useMovies = () => {
  const moviesStore = useMoviesStore();
  const {
    loading,
    error,
    movies,
    totalPages,
    currentPage,
    totalMovies,
    currentMovie,
    lastParams
  } = storeToRefs(moviesStore);

  const fetchMovies = async (params: SearchParams = {}) => {
    return await moviesStore.fetchMovies(params);
  };

  const searchMovies = async (title: string, page: number = 1) => {
    return await fetchMovies({ title, page });
  };

  const loadPage = async (page: number) => {
    const params = {
      ...lastParams.value,
      page
    };
    return await fetchMovies(params);
  };

  return {
    loading,
    error,
    movies,
    totalPages,
    currentPage,
    totalMovies,
    currentMovie,
    lastParams,
    fetchMovies,
    searchMovies,
    loadPage
  };
};
