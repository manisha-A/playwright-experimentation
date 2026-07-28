import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('has title', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);

  const browserName = testInfo.project.name; // chromium || firefox
  await page.addStyleTag({
    content: `
      .engine-badge {
        position: fixed;
        top: 16px;
        left: 16px;
        z-index: 999999;
        padding: 10px 14px;
        border-radius: 10px;
        font: 700 16px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        background: rgba(0,0,0,0.75);
        color: white;
        letter-spacing: 0.5px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.25);
      }
    `,
  });

  await page.evaluate((name) => {
    const badge = document.createElement('div');
    badge.className = 'engine-badge';
    badge.textContent = `Engine: ${name}`;
    document.body.appendChild(badge);
  }, browserName);

  const outDir = path.join(testInfo.project.outputDir, 'above-the-fold');
  fs.mkdirSync(outDir, { recursive: true });

  const filePath = path.join(outDir, `aboveTheFold-${browserName}.png`)
  await page.screenshot({path: filePath, fullPage: false})
});
