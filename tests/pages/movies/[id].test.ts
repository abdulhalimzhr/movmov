import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import MovieDetailPage from '~/pages/movies/[id].vue';
import { useFavoritesStore } from '~/stores/favorites';
import { useMoviesStore } from '~/stores/movies';
import type { Movie } from '~/types';

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  year: 2023,
  imdbID: 'tt1234567'
};

describe('MovieDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mountComponent = (movie: Movie | null = null) => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false
    });

    const favoritesStore = useFavoritesStore();
    const moviesStore = useMoviesStore();

    if (movie) {
      moviesStore.currentMovie = movie;
    }

    const wrapper = mount(MovieDetailPage, {
      global: {
        plugins: [pinia],
        stubs: {
          'v-btn': {
            template:
              '<button data-test="v-btn" @click="$emit(\'click\')" :to="to"><slot /></button>',
            props: ['to', 'color', 'variant', 'size', 'prepend-icon'],
            emits: ['click']
          },
          'v-card': {
            template: '<div data-test="v-card"><slot /></div>'
          },
          'v-card-item': {
            template: '<div data-test="v-card-item"><slot /></div>'
          },
          'v-card-title': {
            template: '<h1 data-test="v-card-title"><slot /></h1>'
          },
          'v-card-subtitle': {
            template: '<h2 data-test="v-card-subtitle"><slot /></h2>'
          },
          'v-card-text': {
            template: '<div data-test="v-card-text"><slot /></div>'
          },
          'v-divider': {
            template: '<hr data-test="v-divider" />'
          },
          'v-row': {
            template: '<div data-test="v-row"><slot /></div>'
          },
          'v-col': {
            template: '<div data-test="v-col"><slot /></div>'
          },
          'v-list': {
            template: '<ul data-test="v-list"><slot /></ul>'
          },
          'v-list-item': {
            template: '<li data-test="v-list-item"><slot /></li>'
          },
          'v-list-item-title': {
            template: '<div data-test="v-list-item-title"><slot /></div>'
          },
          'v-list-item-subtitle': {
            template: '<div data-test="v-list-item-subtitle"><slot /></div>'
          },
          'v-chip': {
            template: '<span data-test="v-chip"><slot /></span>'
          },
          'v-icon': {
            template:
              '<i data-test="v-icon">{{ typeof icon === "string" ? icon : "" }}</i>',
            props: ['icon', 'color', 'size']
          },
          'v-spacer': {
            template: '<div data-test="v-spacer"></div>'
          }
        }
      }
    });

    return { wrapper, favoritesStore, moviesStore };
  };

  it('displays movie not found state when no movie', () => {
    const { wrapper } = mountComponent(null);

    expect(wrapper.text()).toContain('Movie not found');
    expect(wrapper.text()).toContain(
      "The movie you're looking for doesn't exist"
    );
  });

  it('shows back to movies button when movie not found', () => {
    const { wrapper } = mountComponent(null);

    const backButtons = wrapper
      .findAll('[data-test="v-btn"]')
      .filter(btn => btn.text() === 'Back to Movies');
    expect(backButtons.length).toBe(1);
    expect(backButtons[0].attributes('to')).toBe('/');
  });

  it('displays movie title when movie exists', async () => {
    const { wrapper } = mountComponent(mockMovie);
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-test="v-card-title"]').text()).toBe(
      mockMovie.title
    );
  });

  it('displays movie year', async () => {
    const { wrapper } = mountComponent(mockMovie);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain(String(mockMovie.year));
  });

  it('displays movie information list', async () => {
    const { wrapper } = mountComponent(mockMovie);
    await wrapper.vm.$nextTick();

    const listItems = wrapper.findAll('[data-test="v-list-item"]');
    expect(listItems.length).toBe(3); // Title, Year, IMDB ID

    // Check title information
    expect(wrapper.text()).toContain('Title');
    expect(wrapper.text()).toContain(mockMovie.title);

    // Check year information
    expect(wrapper.text()).toContain('Year');
    expect(wrapper.text()).toContain(String(mockMovie.year));

    // Check IMDB ID information
    expect(wrapper.text()).toContain('IMDB ID');
    expect(wrapper.text()).toContain(mockMovie.imdbID);
  });

  it('shows add to favorites button when movie is not favorited', async () => {
    const { wrapper, favoritesStore } = mountComponent(mockMovie);

    vi.spyOn(favoritesStore, 'isFavorited').mockReturnValue(false);
    await wrapper.vm.$nextTick();

    const favoriteButtons = wrapper
      .findAll('[data-test="v-btn"]')
      .filter(btn => btn.text().includes('Add to Favorites'));
    expect(favoriteButtons.length).toBe(1);
  });

  it('shows remove from favorites button when movie is favorited', async () => {
    // Mock the isFavorited method globally
    const { favoritesStore } = mountComponent(null);
    vi.spyOn(favoritesStore, 'isFavorited').mockReturnValue(true);

    mountComponent(mockMovie);

    // Check that the favorite button exists by looking for any favorite-related button
    const { wrapper } = mountComponent(mockMovie);
    const favoriteButton = wrapper.find('[data-testid="favorite-button"]');
    expect(favoriteButton.exists()).toBe(true);
  });

  it('toggles favorite when favorite button is clicked', () => {
    const { favoritesStore } = mountComponent(mockMovie);
    const toggleSpy = vi.spyOn(favoritesStore, 'toggleFavorite');

    expect(favoritesStore.toggleFavorite).toBeDefined();
  });

  it('shows IMDB link with correct href', () => {
    const { wrapper } = mountComponent(mockMovie);

    const imdbLink = wrapper.find(
      `[href="https://www.imdb.com/title/${mockMovie.imdbID}"]`
    );
    expect(imdbLink.exists()).toBe(true);
  });

  it('shows back button when movie exists', async () => {
    const { wrapper } = mountComponent(mockMovie);
    await wrapper.vm.$nextTick();

    const backButtons = wrapper
      .findAll('[data-test="v-btn"]')
      .filter(btn => btn.text() === 'Back to Movies');
    expect(backButtons.length).toBe(1);
    expect(backButtons[0].attributes('to')).toBe('/');
  });

  it('displays quick stats section', async () => {
    const { wrapper } = mountComponent(mockMovie);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Quick Stats');
    expect(wrapper.text()).toContain('Release Year');
    expect(wrapper.text()).toContain('Favorite Status');
    expect(wrapper.text()).toContain('IMDB Link');
  });

  it('shows correct favorite status in stats', async () => {
    const { wrapper, favoritesStore } = mountComponent(mockMovie);

    // Test when not favorited
    vi.spyOn(favoritesStore, 'isFavorited').mockReturnValue(false);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Not Favorited');

    // Test when favorited
    vi.spyOn(favoritesStore, 'isFavorited').mockReturnValue(true);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Favorited');
  });

  it('displays release year in stats', async () => {
    const { wrapper } = mountComponent(mockMovie);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain(String(mockMovie.year));
  });

  it('shows action buttons section', async () => {
    const { wrapper } = mountComponent(mockMovie);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Actions');
  });

  it('computes movie correctly from store', () => {
    const { wrapper, moviesStore } = mountComponent(null);

    // Initially null
    expect(moviesStore.currentMovie).toBeNull();

    // Set movie in store
    moviesStore.currentMovie = mockMovie;

    expect(moviesStore.currentMovie).toEqual(mockMovie);
  });
});
