import { test, expect } from '@playwright/test';

const emptyResponse = {
  success: true,
  data: {
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
    data: []
  }
};

test.describe('Favorites page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/movies**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(emptyResponse)
      });
    });

    await page.goto('/favorites');
    await page.evaluate(() => localStorage.clear());
  });

  test('shows empty state and browse button', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Favorite Movies', exact: true })
    ).toBeVisible();
    await expect(page.getByText('No favorite movies yet')).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Browse Movies' })
    ).toBeVisible();
  });

  test('clear all dialog displays and cancels correctly', async ({ page }) => {
    // Seed a favorite
    await page.evaluate(() => {
      localStorage.setItem(
        'movie-favorites',
        JSON.stringify([
          {
            id: 1,
            title: 'Seed Movie',
            year: 2024,
            imdbID: 'tt0000001',
            favoritedAt: new Date().toISOString()
          }
        ])
      );
    });

    await page.reload();

    await expect(page.locator('.movie-card')).toHaveCount(1);

    await page.getByRole('button', { name: /clear all favorites/i }).click();
    await expect(page.getByText(/remove all 1 favorite movies/)).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.locator('.movie-card')).toHaveCount(1);
  });
});
