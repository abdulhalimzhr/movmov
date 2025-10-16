import { test, expect } from '@playwright/test';

const defaultResponse = {
  success: true,
  data: {
    page: 1,
    per_page: 10,
    total: 2,
    total_pages: 1,
    data: [
      {
        id: 1,
        title: 'Interstellar',
        year: 2014,
        imdbID: 'tt0816692'
      },
      {
        id: 2,
        title: 'Inception',
        year: 2010,
        imdbID: 'tt1375666'
      }
    ]
  }
};

const waterResponse = {
  success: true,
  data: {
    page: 1,
    per_page: 10,
    total: 1,
    total_pages: 1,
    data: [
      {
        id: 3,
        title: 'Waterworld',
        year: 1995,
        imdbID: 'tt0114898'
      }
    ]
  }
};

test.describe('Home end-to-end', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/movies**', async route => {
      const url = new URL(route.request().url());
      const title = (url.searchParams.get('title') || '').toLowerCase();
      const response = title.includes('water')
        ? waterResponse
        : defaultResponse;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });

    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('searching updates results and pagination', async ({ page }) => {
    await expect(
      page.getByText('Find your next favorite movie', { exact: true })
    ).toBeVisible();

    const searchField = page.getByRole('textbox', {
      name: /search movies by title/i
    });
    await searchField.fill('water');
    await page.getByRole('button', { name: 'Search', exact: true }).click();

    await expect(page).toHaveURL(/title=water/);
    await expect(page.locator('.movie-card')).toHaveCount(1);
    await expect(page.getByText(/Showing 1 of 1 movies/)).toBeVisible();
    await expect(page.locator('.v-pagination')).toHaveCount(0);
  });

  test('user can add a movie to favorites and see it listed', async ({
    page
  }) => {
    await page.goto('/favorites');
    await expect(page.getByText('No favorite movies yet')).toBeVisible();

    await page.goto('/');

    const firstCard = page.locator('.movie-card').first();
    await expect(firstCard).toBeVisible();
    await firstCard.getByTestId('favorite-toggle').click();

    await page.goto('/favorites');
    await expect(page.getByText('No favorite movies yet')).not.toBeVisible();
    await expect(page.locator('.movie-card')).toHaveCount(1);
  });
});
