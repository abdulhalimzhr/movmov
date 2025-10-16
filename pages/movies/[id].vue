<script lang="ts" setup>
import type { Movie } from '~/types';

const favoritesStore = useFavoritesStore();
const movieStore = useMoviesStore();

const movie = computed<Movie | null>(() => {
  return movieStore.currentMovie || null;
});

useSeoMeta({
  title: movie.value?.title || 'Movie Details',
  description: `View details for ${movie.value?.title || 'movie'}`
});

const toggleFavorite = () => {
  if (movie.value) {
    favoritesStore.toggleFavorite(movie.value);
  }
};
</script>

<template>
  <v-container fluid>
    <v-row v-if="!movie">
      <v-col cols="12" class="text-center py-12">
        <v-icon size="64" color="warning"> mdi-movie-off </v-icon>
        <h3 class="text-h6 mt-4">Movie not found</h3>
        <p class="text-body-2 text-grey-darken-1 mt-2">
          The movie you're looking for doesn't exist.
        </p>
        <v-btn
          color="primary"
          class="mt-4"
          to="/"
          prepend-icon="mdi-arrow-left"
        >
          Back to Movies
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" md="8" offset-md="2">
        <v-card>
          <v-card-item>
            <v-btn
              variant="text"
              prepend-icon="mdi-arrow-left"
              class="mb-4"
              to="/"
            >
              Back to Movies
            </v-btn>

            <v-card-title class="text-h4 mb-4">
              {{ movie.title }}
            </v-card-title>

            <v-card-subtitle class="text-h6 mb-4">
              <v-chip size="large" color="primary" variant="outlined">
                <v-icon left>mdi-calendar</v-icon>
                {{ movie.year }}
              </v-chip>
            </v-card-subtitle>
          </v-card-item>

          <v-divider />

          <v-card-text>
            <v-row>
              <v-col cols="12" md="8">
                <div class="text-h6 mb-3">Movie Information</div>

                <v-list>
                  <v-list-item>
                    <template #prepend>
                      <v-icon color="primary">mdi-film</v-icon>
                    </template>
                    <v-list-item-title>Title</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ movie.title }}
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template #prepend>
                      <v-icon color="primary">mdi-calendar</v-icon>
                    </template>
                    <v-list-item-title>Year</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ movie.year }}
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template #prepend>
                      <v-icon color="primary">mdi-identifier</v-icon>
                    </template>
                    <v-list-item-title>IMDB ID</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ movie.imdbID }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>

              <v-col cols="12" md="4">
                <div class="text-h6 mb-3">Actions</div>

                <v-btn
                  :color="
                    favoritesStore.isFavorited(movie) ? 'error' : 'primary'
                  "
                  variant="elevated"
                  size="large"
                  block
                  class="mb-3"
                  @click="toggleFavorite"
                >
                  <v-icon left>
                    {{
                      favoritesStore.isFavorited(movie)
                        ? 'mdi-heart'
                        : 'mdi-heart-outline'
                    }}
                  </v-icon>
                  {{
                    favoritesStore.isFavorited(movie)
                      ? 'Remove from Favorites'
                      : 'Add to Favorites'
                  }}
                </v-btn>

                <v-btn
                  variant="outlined"
                  size="large"
                  block
                  :href="`https://www.imdb.com/title/${movie.imdbID}`"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <v-icon left>mdi-link-variant</v-icon>
                  View on IMDB
                </v-btn>
              </v-col>
            </v-row>

            <!-- Additional movie info (if we had more data from API) -->
            <v-divider class="my-6" />

            <v-row>
              <v-col cols="12">
                <div class="text-h6 mb-3">Quick Stats</div>
                <v-row>
                  <v-col cols="12" sm="4">
                    <v-card variant="outlined" class="text-center pa-4">
                      <v-icon color="primary" size="32" class="mb-2">
                        mdi-calendar-range
                      </v-icon>
                      <div class="text-h6">{{ movie.year }}</div>
                      <div class="text-caption text-grey-darken-1">
                        Release Year
                      </div>
                    </v-card>
                  </v-col>

                  <v-col cols="12" sm="4">
                    <v-card variant="outlined" class="text-center pa-4">
                      <v-icon
                        :color="
                          favoritesStore.isFavorited(movie)
                            ? 'error'
                            : 'grey-lighten-1'
                        "
                        size="32"
                        class="mb-2"
                      >
                        {{
                          favoritesStore.isFavorited(movie)
                            ? 'mdi-heart'
                            : 'mdi-heart-outline'
                        }}
                      </v-icon>
                      <div class="text-h6">
                        {{
                          favoritesStore.isFavorited(movie)
                            ? 'Favorited'
                            : 'Not Favorited'
                        }}
                      </div>
                      <div class="text-caption text-grey-darken-1">
                        Favorite Status
                      </div>
                    </v-card>
                  </v-col>

                  <v-col cols="12" sm="4">
                    <v-card variant="outlined" class="text-center pa-4">
                      <v-icon color="primary" size="32" class="mb-2">
                        mdi-link-variant
                      </v-icon>
                      <div class="text-h6">Available</div>
                      <div class="text-caption text-grey-darken-1">
                        IMDB Link
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
</style>
