export interface Movie {
  id: number;
  title: string;
  year: number;
  imdbID: string;
}

export interface MovieApiItem {
  id: number;
  Title: string;
  Year: number;
  imdbID: string;
}

export interface PaginatedResponse<T> {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: T[];
}

export type MovieApiResponse = PaginatedResponse<MovieApiItem>;
export type MoviesResponse = PaginatedResponse<Movie>;

export interface SearchParams {
  title?: string;
  page?: number;
}

export interface FavoriteMovie extends Movie {
  favoritedAt: string;
}
