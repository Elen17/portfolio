import { test, expect } from '@playwright/test'

test('home page loads with hero title', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: /scalable architecture|portfolio|engineer/i }).first(),
  ).toBeVisible()
})
