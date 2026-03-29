import { test, expect } from '@playwright/test';

test('login page loads', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('h1')).toContainText('Login');
});

test('dashboard loads after login', async ({ page }) => {
  // Assuming login logic
  await page.goto('/login');
  // Fill form and submit
  // Then check dashboard
});