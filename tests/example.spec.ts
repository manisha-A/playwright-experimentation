import { test as base, expect, Page } from '@playwright/test';

type Fixtures = {
  homePage: Page;
}

const test = base.extend<Fixtures>({
  homePage: async ({page}, use) => {
    await page.goto('https://playwright.dev/', {waitUntil: 'domcontentloaded'});
    await use(page);
  },
});


test('has title', async ({ homePage }) => {
  // Expect a title "to contain" a substring.
  await expect(homePage).toHaveTitle(/Playwright/);
});

test('get started link', async ({ homePage }) => {

  // Click the get started link.
  await homePage.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(homePage.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
