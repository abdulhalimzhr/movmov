<template>
  <v-app>
    <v-app-bar title="Movmov" color="primary" dark>
      <template #append>
        <v-tooltip text="View Favorites">
          <template #activator="{ props }">
            <v-btn icon="mdi-heart" v-bind="props" :to="{ path: '/favorites' }">
              <v-icon>mdi-heart</v-icon>
              <v-badge
                v-if="favoritesStore.favoriteCount > 0"
                :content="favoritesStore.favoriteCount.toString()"
                color="accent"
              />
            </v-btn>
          </template>
        </v-tooltip>
      </template>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>

    <v-footer class="app-footer text-grey-darken-1 py-6">
      <div class="footer-content">
        <span>Movmov 2025</span>
        <span class="dot">•</span>
        <span>by</span>
        <a
          href="https://abdulhalimzhr.com"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link"
        >
          abdulhalimzhr.com
        </a>
        <span class="dot">•</span>
        <span>Made with Nuxt 3 + Vuetify</span>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Movmov',
  description: 'Browse and search movies with favorites functionality'
});

const favoritesStore = useFavoritesStore();

onMounted(() => {
  favoritesStore.loadFavorites();
});
</script>

<style scoped>
.app-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  font-size: 0.85rem;
  display: flex;
  justify-content: center;
}

.footer-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  text-align: center;
}

.footer-link {
  color: inherit;
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}

.dot {
  opacity: 0.6;
}
</style>
