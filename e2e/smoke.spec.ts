import { test, expect } from '@playwright/test'

test('home page loads with expected document title', async ({ page }) => {
  await page.goto('/');

  const title = await page.title();
  expect(title).toBe('Elen Khachatryan — Software Engineer');
});