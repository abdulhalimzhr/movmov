<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6 text-center">
          <v-icon color="error" class="mr-2"> mdi-heart </v-icon>
          My Favorite Movies
        </h1>
      </v-col>
    </v-row>

    <v-row v-if="favorites.length > 0">
      <v-col cols="8" class="d-flex justify-end mb-4">
        <v-btn
          color="error"
          variant="outlined"
          prepend-icon="mdi-heart-broken"
          @click="confirmClearFavorites"
        >
          Clear All Favorites
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="favorites.length > 0">
      <v-col
        v-for="favorite in sortedFavorites"
        :key="favorite.imdbID"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <MovieCard
          :movie="favorite"
          :is-favorited="true"
          @toggle-favorite="toggleFavorite(favorite)"
        />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" class="text-center py-12">
        <v-icon size="64" color="grey-lighten-1"> mdi-heart-outline </v-icon>
        <h3 class="text-h6 mt-4 text-grey-darken-1">No favorite movies yet</h3>
        <p class="text-body-2 text-grey-darken-1 mt-2">
          Start adding movies to your favorites to see them here!
        </p>
        <v-btn
          color="primary"
          class="mt-4"
          to="/"
          prepend-icon="mdi-movie-search"
        >
          Browse Movies
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="favorites.length > 0">
      <v-col cols="12" class="text-center text-grey-darken-1">
        <small>
          {{ favoriteCount }} favorite movie{{ favoriteCount !== 1 ? 's' : '' }}
        </small>
      </v-col>
    </v-row>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="showClearDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6"> Clear All Favorites? </v-card-title>
        <v-card-text>
          Are you sure you want to remove all
          {{ favoriteCount }} favorite movies? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showClearDialog = false">
            Cancel
          </v-btn>
          <v-btn color="error" variant="text" @click="handleClearFavorites">
            Clear All
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import type { FavoriteMovie } from '~/types';

// SEO meta
useSeoMeta({
  title: 'My Favorite Movies',
  description: 'View and manage your favorite movies'
});

// Store
const favoritesStore = useFavoritesStore();

const favorites = computed(() => favoritesStore.favorites);

// Dialog state
const showClearDialog = ref(false);

// Computed properties from store
const favoriteCount = computed(() => favoritesStore.favoriteCount);
const sortedFavorites = computed<FavoriteMovie[]>(
  () => favoritesStore.sortedFavorites
);

// Methods
const confirmClearFavorites = () => {
  showClearDialog.value = true;
};

const handleClearFavorites = () => {
  favoritesStore.clearFavorites();
  showClearDialog.value = false;
};

const toggleFavorite = (movie: FavoriteMovie) => {
  favoritesStore.toggleFavorite(movie);
};
</script>

<style scoped>
.movie-card {
  transition: all 0.3s ease;
}

.movie-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
