import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import MovieCard from '~/components/MovieCard.vue';
import { useFavoritesStore } from '~/stores/favorites';
import { useMoviesStore } from '~/stores/movies';
import type { Movie } from '~/types';

const routerMock = vi.hoisted(() => ({
  push: vi.fn()
}));

vi.mock('vue-router', () => ({
  useRouter: () => routerMock
}));

const mockMovie: Movie = {
  id: 1,
  title: 'Waterworld',
  year: 1995,
  imdbID: 'tt0114898'
};

describe('MovieCard', () => {
  beforeEach(() => {
    routerMock.push.mockReset();
  });

  const mountComponent = (
    props: Partial<{ movie: Movie; loading: boolean }> = {}
  ) => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false
    });

    const favoritesStore = useFavoritesStore();
    const moviesStore = useMoviesStore();

    const wrapper = mount(MovieCard, {
      props: {
        movie: mockMovie,
        ...props
      },
      global: {
        plugins: [pinia]
      }
    });

    return {
      wrapper,
      favoritesStore,
      moviesStore
    };
  };

  it('renders movie information when not loading', () => {
    const { wrapper } = mountComponent();

    expect(wrapper.text()).toContain(mockMovie.title);
    expect(wrapper.text()).toContain(String(mockMovie.year));
    expect(wrapper.text()).toContain(mockMovie.imdbID);
    expect(wrapper.find('.movie-card__skeleton').exists()).toBe(false);
  });

  it('shows skeleton placeholders when loading', () => {
    const { wrapper } = mountComponent({ loading: true });

    expect(wrapper.find('.movie-card__skeleton').exists()).toBe(true);
    expect(wrapper.text()).not.toContain(mockMovie.title);
  });

  it('toggles favorite status via store', async () => {
    const { wrapper, favoritesStore } = mountComponent();
    const toggleSpy = vi.spyOn(favoritesStore, 'toggleFavorite');

    await wrapper.vm.$nextTick();
    const nodesWithDataTest = wrapper.findAll('[data-test]');
    expect(nodesWithDataTest.length).toBeGreaterThan(0);
    const favoriteButton = wrapper.find('[data-test="favorite-toggle"]');
    expect(favoriteButton.exists()).toBe(true);

    await favoriteButton.trigger('click');
    expect(toggleSpy).toHaveBeenCalledTimes(1);
    expect(toggleSpy).toHaveBeenCalledWith(mockMovie);
  });

  it('navigates to movie details when card is clicked', async () => {
    const { wrapper, moviesStore } = mountComponent();
    const setCurrentSpy = vi.spyOn(moviesStore, 'setCurrentMovie');

    await wrapper.trigger('click');

    expect(setCurrentSpy).toHaveBeenCalledWith(mockMovie);
    expect(routerMock.push).toHaveBeenCalledWith(`/movies/${mockMovie.imdbID}`);
  });

  it('disables navigation when loading', async () => {
    const { wrapper, moviesStore } = mountComponent({ loading: true });
    const setCurrentSpy = vi.spyOn(moviesStore, 'setCurrentMovie');

    await wrapper.trigger('click');

    expect(setCurrentSpy).not.toHaveBeenCalled();
    expect(routerMock.push).not.toHaveBeenCalled();
  });
});
