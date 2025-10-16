<script lang="ts" setup>
  import type { Movie } from '~/types';

  interface Props {
    movie: Movie;
    loading?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false
  });

  const favoritesStore = useFavoritesStore();
  const movieStore = useMoviesStore();
  const router = useRouter();

  const navigateToDetails = async () => {
    if (props.loading) {
      return;
    }

    movieStore.setCurrentMovie(props.movie);
    await nextTick();
    router.push(`/movies/${props.movie.imdbID}`);
  };

  const toggleFavorite = () => {
    favoritesStore.toggleFavorite(props.movie);
  };
</script>

<template>
  <v-card
    class="movie-card"
    hover
    height="100%"
    @click="navigateToDetails"
  >
    <div
      v-if="loading"
      class="movie-card__skeleton"
    >
      <div class="movie-card__skeleton-left">
        <div class="movie-card__skeleton-title movie-card__shimmer" />
        <div class="movie-card__skeleton-chip movie-card__shimmer" />
        <div class="movie-card__skeleton-meta movie-card__shimmer" />
      </div>
      <div class="movie-card__skeleton-actions">
        <div class="movie-card__skeleton-icon movie-card__shimmer" />
        <div class="movie-card__skeleton-icon movie-card__shimmer" />
      </div>
    </div>

    <v-row
      v-else
      no-gutters
      class="fill-height"
    >
      <v-col>
        <v-card-item>
          <v-card-title class="text-h6 text-truncate">
            {{ movie.title }}
          </v-card-title>

          <v-card-subtitle>
            <v-chip
              size="small"
              color="primary"
              variant="outlined"
            >
              {{ movie.year }}
            </v-chip>
          </v-card-subtitle>
        </v-card-item>

        <v-card-text>
          <div class="text-body-2 text-grey-darken-1">
            IMDB: {{ movie.imdbID }}
          </div>
        </v-card-text>
      </v-col>

      <v-card-actions
        class="justify-end movie-card__actions"
        @click.stop
      >
        <v-tooltip
          :text="
            favoritesStore.isFavorited(movie)
              ? 'Remove from favorites'
              : 'Add to favorites'
          "
        >
          <template v-slot:activator="{ props }">
            <v-btn
              variant="text"
              size="small"
              class="favorite-btn"
              :icon="
                favoritesStore.isFavorited(movie)
                  ? 'mdi-heart'
                  : 'mdi-heart-outline'
              "
              :color="
                favoritesStore.isFavorited(movie)
                  ? 'error'
                  : 'default'
              "
              v-bind="props"
              @click.stop="toggleFavorite"
            ></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="View on IMDB">
          <template v-slot:activator="{ props }">
            <v-btn
              variant="text"
              size="small"
              target="_blank"
              rel="noopener noreferrer"
              class="favorite-btn"
              icon="mdi-link-variant"
              v-bind="props"
              :href="`https://www.imdb.com/title/${movie.imdbID}`"
              @click.stop
            ></v-btn>
          </template>
        </v-tooltip>
      </v-card-actions>
    </v-row>
  </v-card>
</template>

<style lang="scss" scoped>
  .movie-card {
    transition: all 0.3s ease;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &__actions {
      padding: 16px !important;
    }
  }

  .favorite-btn {
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  .movie-card__skeleton {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    min-height: 100%;
    gap: 16px;
  }

  .movie-card__skeleton-left {
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
  }

  .movie-card__skeleton-title {
    width: 45%;
    height: 20px;
    border-radius: 4px;
  }

  .movie-card__skeleton-chip {
    width: 72px;
    height: 28px;
    border-radius: 9999px;
  }

  .movie-card__skeleton-meta {
    width: 120px;
    height: 16px;
    border-radius: 4px;
  }

  .movie-card__skeleton-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .movie-card__skeleton-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  .movie-card__shimmer {
    position: relative;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.08);

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      transform: translateX(-100%);
      background: linear-gradient(
        120deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.35) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      animation: movie-card-skeleton-shimmer 1.4s ease-in-out infinite;
    }
  }

  @keyframes movie-card-skeleton-shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>
