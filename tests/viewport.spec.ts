import { test, expect, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const iPhone = devices['iPhone 13'];

//desktop test
test('Desktop: has title', async ({ page }) => {
  await page.setViewportSize({width: 1280, height: 800 })
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);

});

//mobile test


test.use({
  ...iPhone,
})

test('Mobile: get started link - iphone simulation', async ({ page }, testInfo) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();

  const browserName = testInfo.project.name; // chromium || firefox
  const outDir = path.join(testInfo.project.outputDir, 'above-the-fold');
  fs.mkdirSync(outDir, { recursive: true });
  
  const filePath = path.join(outDir, `aboveTheFold-${browserName}.png`)
  await page.screenshot({path: filePath, fullPage: false})
});


