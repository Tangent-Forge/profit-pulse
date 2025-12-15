import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Check for main heading
    await expect(page.getByRole('heading', { name: /Profit Pulse/i })).toBeVisible();

    // Check for tagline
    await expect(page.getByText(/Stop overthinking. Start building./i)).toBeVisible();

    // Check navigation buttons
    await expect(page.getByRole('link', { name: /Quick QPV/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Full Evaluation/i })).toBeVisible();
  });

  test('should navigate to QPV calculator', async ({ page }) => {
    await page.goto('/');

    // Click on Quick QPV button
    await page.getByRole('link', { name: /Quick QPV/i }).click();

    // Should navigate to evaluate page
    await expect(page).toHaveURL('/evaluate');
  });

  test('should display pricing tiers', async ({ page }) => {
    await page.goto('/');

    // Check for pricing tiers
    await expect(page.getByText(/Free QPV/i)).toBeVisible();
    await expect(page.getByText(/Starter/i)).toBeVisible();
    await expect(page.getByText(/Explorer/i)).toBeVisible();

    // Check for prices
    await expect(page.getByText('$0')).toBeVisible();
    await expect(page.getByText('$9')).toBeVisible();
    await expect(page.getByText('$29')).toBeVisible();
  });

  test('should not have accessibility violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
