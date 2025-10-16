<template>
  <v-app>
    <v-app-bar
      title="Movmov"
      color="primary"
      dark
    >
      <template #append>
        <v-btn
          icon="mdi-heart"
          :to="{ path: '/favorites' }"
        >
          <v-icon>mdi-heart</v-icon>
          <v-badge
            v-if="favoritesStore.favoriteCount > 0"
            :content="favoritesStore.favoriteCount.toString()"
            color="accent"
          />
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  useSeoMeta({
    title: 'Movmov',
    description: 'Simple movie web search'
  });

  const favoritesStore = useFavoritesStore();

  onMounted(() => {
    favoritesStore.loadFavorites();
  });
</script>
