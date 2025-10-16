<script lang="ts" setup>
useSeoMeta({
  title: 'Movmov',
  description: 'Browse and search movies with favorites functionality'
});

const {
  loading,
  error,
  movies,
  totalPages,
  currentPage,
  totalMovies,
  searchMovies,
  loadPage
} = useMovies();

const favoritesStore = useFavoritesStore();

const searchQuery = ref('');
const router = useRouter();
const route = useRoute();

const handleSearch = async () => {
  const query = searchQuery.value?.trim() || '';

  await router.push({
    query: {
      title: query || undefined,
      page: 1
    }
  });

  await searchMovies(query, 1);
};

const handleClearSearch = async () => {
  searchQuery.value = '';
  await router.push({ query: {} });
  await searchMovies('', 1);
};

const handlePageChange = async (page: number) => {
  await router.push({
    query: {
      ...route.query,
      page
    }
  });

  await loadPage(page);
};

onMounted(async () => {
  const queryTitle = route.query.title as string;
  const queryPage = Number(route.query.page) || 1;

  if (queryTitle) {
    searchQuery.value = queryTitle;
    await searchMovies(queryTitle, queryPage);
  } else if (movies.value.length === 0) {
    await searchMovies('', 1);
  }
});
</script>

<template>
  <v-container>
    <div class="search-container">
      <v-row>
        <v-col cols="12" md="6" offset-md="3">
          <v-text-field
            v-model="searchQuery"
            label="Search movies by title"
            prepend-inner-icon="mdi-movie-search"
            variant="outlined"
            clearable
            @keyup.enter="handleSearch"
            @click:clear="handleClearSearch"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="text-center">
          <v-btn color="primary" :loading="loading" @click="handleSearch">
            <v-icon left>mdi-magnify</v-icon>
            Search
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <v-alert v-if="error" type="error" dismissible class="mb-4">
      {{ error }}
    </v-alert>

    <v-row v-if="loading" align="center">
      <v-col v-for="n in 10" :key="n" cols="8" class="mx-auto">
        <MovieCard
          :movie="{ id: n, title: '', year: 0, imdbID: '' }"
          :is-favorited="false"
          :loading="true"
        />
      </v-col>
    </v-row>

    <v-row v-else-if="movies.length > 0" align="center">
      <v-col
        v-for="movie in movies"
        :key="movie.imdbID"
        cols="8"
        class="mx-auto"
      >
        <MovieCard
          :movie="movie"
          :is-favorited="favoritesStore.isFavorited(movie)"
          @toggle-favorite="favoritesStore.toggleFavorite(movie)"
        />
      </v-col>
    </v-row>

    <v-row v-else-if="!loading && searchQuery">
      <v-col cols="12" class="text-center">
        <v-icon size="64" color="grey-lighten-1"> mdi-movie-off </v-icon>
        <h3 class="text-h6 mt-4 text-grey-darken-1">
          No movies found for "{{ searchQuery }}"
        </h3>
      </v-col>
    </v-row>

    <v-row v-else-if="!loading && movies.length === 0">
      <v-col cols="12" class="text-center">
        <v-icon size="64" color="grey-lighten-1"> mdi-movie-search </v-icon>
        <h3 class="text-h6 mt-4 text-grey-darken-1">
          Search for movies to get started
        </h3>
      </v-col>
    </v-row>

    <div v-if="totalPages > 1" class="pagination-container">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
        @update:model-value="handlePageChange"
      />
    </div>

    <v-row v-if="movies.length > 0">
      <v-col cols="12" class="text-center text-grey-darken-1">
        <small>
          Showing {{ movies.length }} of {{ totalMovies }} movies
          {{ searchQuery ? `for "${searchQuery}"` : '' }}
        </small>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.search-container {
  margin-bottom: 2rem;
}

.pagination-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}
</style>
