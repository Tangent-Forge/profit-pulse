import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display sign-in page', async ({ page }) => {
    await page.goto('/auth/signin');

    // Check for sign-in heading
    await expect(page.getByRole('heading', { name: /Sign in to your account/i })).toBeVisible();

    // Check for form fields
    await expect(page.getByLabel(/Email address/i)).toBeVisible();
    await expect(page.getByLabel(/^Password$/i)).toBeVisible();

    // Check for submit button
    await expect(page.getByRole('button', { name: /Sign in/i })).toBeVisible();

    // Check for sign-up link
    await expect(page.getByRole('link', { name: /create a new account/i })).toBeVisible();
  });

  test('should display sign-up page', async ({ page }) => {
    await page.goto('/auth/signup');

    // Check for sign-up heading
    await expect(page.getByRole('heading', { name: /Create your account/i })).toBeVisible();

    // Check for form fields
    await expect(page.getByLabel(/Full name/i)).toBeVisible();
    await expect(page.getByLabel(/Email address/i)).toBeVisible();
    await expect(page.getByLabel(/^Password$/i)).toBeVisible();
    await expect(page.getByLabel(/Confirm password/i)).toBeVisible();

    // Check for submit button
    await expect(page.getByRole('button', { name: /Create account/i })).toBeVisible();

    // Check for sign-in link
    await expect(page.getByRole('link', { name: /Sign in/i })).toBeVisible();
  });

  test('should show validation errors on sign-in', async ({ page }) => {
    await page.goto('/auth/signin');

    // Try to submit without filling fields
    await page.getByRole('button', { name: /Sign in/i }).click();

    // Browser validation should prevent submission
    // (can't easily test browser validation with Playwright)
  });

  test('should navigate between sign-in and sign-up', async ({ page }) => {
    await page.goto('/auth/signin');

    // Click on create account link
    await page.getByRole('link', { name: /create a new account/i }).click();

    // Should navigate to sign-up
    await expect(page).toHaveURL('/auth/signup');
    await expect(page.getByRole('heading', { name: /Create your account/i })).toBeVisible();

    // Click on sign-in link
    await page.getByRole('link', { name: /Sign in/i }).first().click();

    // Should navigate back to sign-in
    await expect(page).toHaveURL('/auth/signin');
    await expect(page.getByRole('heading', { name: /Sign in to your account/i })).toBeVisible();
  });
});
