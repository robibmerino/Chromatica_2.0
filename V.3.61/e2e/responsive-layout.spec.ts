import { test, expect, type Page } from '@playwright/test';

const VIEWPORT_MATRIX = [
  { name: 'hd-720p', width: 1280, height: 720 },
  { name: 'laptop-1366', width: 1366, height: 768 },
  { name: 'laptop-1536', width: 1536, height: 864 },
  { name: 'fullhd', width: 1920, height: 1080 },
  { name: 'ultrawide', width: 2560, height: 1080 },
] as const;

async function openMainView(page: Page) {
  await page.goto('/?share=layout-smoke');

  const startButton = page.getByRole('button', { name: /Comenzar/i });
  if (await startButton.isVisible().catch(() => false)) {
    await startButton.click();
  }

  const continueWithoutAuth = page.getByRole('button', { name: /Continuar sin iniciar sesión/i });
  if (await continueWithoutAuth.isVisible().catch(() => false)) {
    await continueWithoutAuth.click();
  }

  await expect(page.getByText(/¿Cómo quieres inspirarte\?/i)).toBeVisible({ timeout: 15000 });
}

test.describe('Chromatica responsive layout', () => {
  for (const viewport of VIEWPORT_MATRIX) {
    test(`mantiene arquitectura estable en ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await openMainView(page);

      // El shell principal debe ocupar exactamente el viewport.
      const appMetrics = await page.evaluate(() => {
        const root = document.getElementById('root');
        const rootRect = root?.getBoundingClientRect();
        return {
          innerHeight: window.innerHeight,
          rootHeight: rootRect?.height ?? 0,
        };
      });
      expect(Math.abs(appMetrics.rootHeight - appMetrics.innerHeight)).toBeLessThanOrEqual(1);

      // En estas vistas no debe aparecer scroll vertical de página.
      await page.mouse.wheel(0, 3000);
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBe(0);

      // El bloque de inspiración (hero + tarjetas) debe estar completamente dentro del viewport.
      const inspirationBlock = page.locator('main');
      const blockBox = await inspirationBlock.boundingBox();
      expect(blockBox).not.toBeNull();
      if (blockBox) {
        expect(blockBox.y + blockBox.height).toBeLessThanOrEqual(viewport.height + 1);
      }

      await expect(page.getByRole('button', { name: /Arquetipos/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /Maleta del viajero/i })).toBeVisible();
    });
  }
});
