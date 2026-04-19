import { test, expect } from '@playwright/test';

test.describe('Chromatica smoke', () => {
  test('carga la app, splash visible y navegación a la vista principal', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /Comenzar/i })).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: /Comenzar/i }).click();
    await expect(page.getByText(/paleta|Análisis|Fábrica/i)).toBeVisible({ timeout: 10000 });
  });
});
