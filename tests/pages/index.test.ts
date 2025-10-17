import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import { defineComponent, h } from 'vue';
import IndexPage from '~/pages/index.vue';
import type { Movie } from '~/types';

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  year: 2023,
  imdbID: 'tt1234567'
};

vi.mock('~/composables/useMovies', () => ({
  useMovies: () => ({
    movies: ref<Movie[]>([]),
    loading: ref(false),
    error: ref<string | null>(null),
    totalPages: ref(0),
    currentPage: ref(1),
    totalMovies: ref(0),
    currentMovie: ref(null),
    lastParams: ref({ title: '', page: 1 }),
    fetchMovies: vi.fn(),
    searchMovies: vi.fn(),
    loadPage: vi.fn()
  })
}));

vi.mock('~/stores/favorites', () => ({
  useFavoritesStore: () => ({
    favorites: ref([]),
    isFavorited: vi.fn(() => false),
    toggleFavorite: vi.fn(),
    clearFavorites: vi.fn()
  })
}));

describe('IndexPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mountComponent = () => {
    const wrapper = mount(IndexPage, {
      global: {
        mocks: {
          $route: { query: {} },
          useRouter: () => ({ push: vi.fn() })
        },
        stubs: {
          'v-text-field': defineComponent({
            template:
              '<input type="text" placeholder="Search movies by title" />'
          }),
          'v-btn': defineComponent({
            template: '<button type="button"><slot /></button>'
          }),
          'v-container': defineComponent({
            template: '<div><slot /></div>'
          }),
          'v-row': defineComponent({
            template: '<div><slot /></div>'
          }),
          'v-col': defineComponent({
            template: '<div><slot /></div>'
          }),
          'v-alert': defineComponent({
            template: '<div><slot /></div>'
          }),
          'v-icon': defineComponent({
            template: '<i><slot /></i>'
          }),
          MovieCard: defineComponent({
            template: '<div data-test="movie-card"><slot /></div>'
          })
        }
      }
    });

    return { wrapper };
  };

  it('renders search interface correctly', () => {
    const { wrapper } = mountComponent();

    expect(wrapper.exists()).toBe(true);
  });

  it('shows search input', () => {
    const { wrapper } = mountComponent();

    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
  });

  it('displays search button', () => {
    const { wrapper } = mountComponent();

    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('shows empty state initially', () => {
    const { wrapper } = mountComponent();

    expect(wrapper.text()).toContain('Search for movies to get started');
  });

  it('handles search input interaction', async () => {
    const { wrapper } = mountComponent();

    const searchInput = wrapper.find('input[type="text"]');
    await searchInput.setValue('Test Movie');

    expect((searchInput.element as HTMLInputElement).value).toBe('Test Movie');
  });
});
