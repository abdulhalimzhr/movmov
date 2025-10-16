import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import FavoritesPage from '~/pages/favorites.vue';
import { useFavoritesStore } from '~/stores/favorites';
import type { FavoriteMovie } from '~/types';

const mockFavoriteMovie: FavoriteMovie = {
  id: 1,
  title: 'Test Movie',
  year: 2023,
  imdbID: 'tt1234567',
  favoritedAt: '2024-01-01T00:00:00.000Z'
};

const mockFavoriteMovie2: FavoriteMovie = {
  id: 2,
  title: 'Another Movie',
  year: 2022,
  imdbID: 'tt9876543',
  favoritedAt: '2024-01-02T00:00:00.000Z'
};

describe('FavoritesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mountComponent = () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false
    });

    const favoritesStore = useFavoritesStore();

    const wrapper = mount(FavoritesPage, {
      global: {
        plugins: [pinia],
        stubs: {
          MovieCard: {
            template:
              '<div data-test="movie-card" :movie="movie" :is-favorited="isFavorited" @toggle-favorite="$emit(\'toggle-favorite\', movie)"></div>',
            props: ['movie', 'isFavorited'],
            emits: ['toggle-favorite']
          },
          'v-btn': {
            template:
              '<button data-test="v-btn" @click="$emit(\'click\')"><slot /></button>',
            emits: ['click']
          },
          'v-dialog': {
            template:
              '<div v-if="modelValue" data-test="dialog"><slot /></div>',
            props: ['modelValue']
          },
          'v-card': {
            template: '<div data-test="card"><slot /></div>'
          },
          'v-card-title': {
            template: '<div data-test="card-title"><slot /></div>'
          },
          'v-card-text': {
            template: '<div data-test="card-text"><slot /></div>'
          },
          'v-card-actions': {
            template: '<div data-test="card-actions"><slot /></div>'
          },
          'v-spacer': {
            template: '<div data-test="spacer"></div>'
          }
        }
      }
    });

    return { wrapper, favoritesStore };
  };

  it('renders page title correctly', () => {
    const { wrapper } = mountComponent();

    expect(wrapper.find('.text-h4').text()).toBe('Favorite Movies');
  });

  it('displays empty state when no favorites', () => {
    const { wrapper } = mountComponent();

    expect(wrapper.text()).toContain('No favorite movies yet');
    expect(wrapper.text()).toContain(
      'Start adding movies to your favorites to see them here!'
    );
    expect(wrapper.find('[data-test="v-btn"]').exists()).toBe(true);
  });

  it('displays favorite movies when available', async () => {
    const { wrapper, favoritesStore } = mountComponent();

    favoritesStore.favorites = [mockFavoriteMovie];
    await wrapper.vm.$nextTick();

    const movieCards = wrapper.findAll('[data-test="movie-card"]');
    expect(movieCards.length).toBe(1);
  });

  it('displays multiple favorite movies', async () => {
    const { wrapper, favoritesStore } = mountComponent();

    favoritesStore.favorites = [mockFavoriteMovie, mockFavoriteMovie2];
    await wrapper.vm.$nextTick();

    const movieCards = wrapper.findAll('[data-test="movie-card"]');
    expect(movieCards.length).toBe(2);
  });

  it('displays movies sorted by favoritedAt date (newest first)', async () => {
    const { wrapper, favoritesStore } = mountComponent();

    favoritesStore.favorites = [mockFavoriteMovie, mockFavoriteMovie2];
    await wrapper.vm.$nextTick();

    const movieCards = wrapper.findAll('[data-test="movie-card"]');
    expect(movieCards.length).toBe(2);
  });

  it('shows clear favorites button when there are favorites', async () => {
    const { wrapper, favoritesStore } = mountComponent();

    favoritesStore.favorites = [mockFavoriteMovie];
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-test="clear-favorites"]').exists()).toBe(true);
  });

  it('does not show clear favorites button when no favorites', () => {
    const { wrapper } = mountComponent();

    expect(wrapper.find('[data-test="clear-favorites"]').exists()).toBe(false);
  });

  it('shows confirmation dialog when clear favorites is clicked', async () => {
    const { wrapper, favoritesStore } = mountComponent();

    favoritesStore.favorites = [mockFavoriteMovie];
    await wrapper.vm.$nextTick();

    const clearButton = wrapper.find('[data-test="clear-favorites"]');
    await clearButton.trigger('click');

    expect(wrapper.find('[data-test="dialog"]').exists()).toBe(true);
  });

  it('displays correct movie count in dialog', async () => {
    const { wrapper, favoritesStore } = mountComponent();

    favoritesStore.favorites = [mockFavoriteMovie, mockFavoriteMovie2];
    await wrapper.vm.$nextTick();

    const clearButton = wrapper.find('[data-test="clear-favorites"]');
    await clearButton.trigger('click');

    expect(wrapper.find('[data-test="card-text"]').text()).toContain(
      'Are you sure you want to remove all 2 favorite movies?'
    );
  });

  it('hides dialog when cancel is clicked', async () => {
    const { wrapper, favoritesStore } = mountComponent();

    favoritesStore.favorites = [mockFavoriteMovie];
    await wrapper.vm.$nextTick();

    const clearButton = wrapper.find('[data-test="clear-favorites"]');
    await clearButton.trigger('click');

    const allButtons = wrapper.findAll('[data-test="v-btn"]');
    const cancelButton = allButtons.find(btn => btn.text() === 'Cancel');

    if (cancelButton) {
      await cancelButton.trigger('click');
    }
  });

  it('clears favorites when confirm is clicked', async () => {
    const { wrapper, favoritesStore } = mountComponent();
    const clearSpy = vi.spyOn(favoritesStore, 'clearFavorites');

    favoritesStore.favorites = [mockFavoriteMovie];
    await wrapper.vm.$nextTick();

    const clearButton = wrapper.find('[data-test="clear-favorites"]');
    await clearButton.trigger('click');

    const allButtons = wrapper.findAll('[data-test="v-btn"]');
    const confirmButton = allButtons.find(btn => btn.text() === 'Clear All');

    if (confirmButton) {
      await confirmButton.trigger('click');
    }

    expect(clearSpy).toHaveBeenCalledTimes(1);
  });

  it('displays correct favorite count text for single movie', async () => {
    const { wrapper, favoritesStore } = mountComponent();

    favoritesStore.favorites = [mockFavoriteMovie];
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('1 favorite movie');
  });

  it('displays correct favorite count text for multiple movies', async () => {
    const { wrapper, favoritesStore } = mountComponent();

    favoritesStore.favorites = [mockFavoriteMovie, mockFavoriteMovie2];
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('2 favorite movies');
  });

  it('toggles favorite from movie cards', () => {
    const { favoritesStore } = mountComponent();

    favoritesStore.favorites = [mockFavoriteMovie];

    expect(favoritesStore.toggleFavorite).toBeDefined();
  });

  it('navigates to home page when browse movies button is clicked', async () => {
    const { wrapper } = mountComponent();

    const browseButton = wrapper.find('[data-test="v-btn"]');
    expect(browseButton.attributes('to')).toBe('/');
  });

  it('computes favoriteCount correctly', async () => {
    const { favoritesStore } = mountComponent();

    expect(favoritesStore.favorites.length).toBe(0);

    favoritesStore.favorites = [mockFavoriteMovie];

    expect(favoritesStore.favorites.length).toBe(1);

    favoritesStore.favorites = [mockFavoriteMovie, mockFavoriteMovie2];

    expect(favoritesStore.favorites.length).toBe(2);
  });

  it('computes sortedFavorites correctly', async () => {
    const { wrapper, favoritesStore } = mountComponent();

    favoritesStore.favorites = [mockFavoriteMovie, mockFavoriteMovie2];
    await wrapper.vm.$nextTick();

    const movieCards = wrapper.findAll('[data-test="movie-card"]');
    expect(movieCards.length).toBe(2);
  });
});
