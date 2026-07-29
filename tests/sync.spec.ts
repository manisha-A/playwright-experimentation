import { test as base, expect, Locator, Page } from '@playwright/test';

type Fixtures = {
  homePage: Page;
}

const test = base.extend<Fixtures>({
  homePage: async ({page}, use) => {
    await page.goto('https://demo.playwright.dev/todomvc/#/', {waitUntil: 'domcontentloaded'});
    await use(page);
  },
});

function toDoInput(homePage: Page): Locator {
  return homePage.getByPlaceholder('What needs to be done?');
}

function toDoItems(homePage: Page): Locator {
  return homePage.locator('.todo-list > li')
}

function itemByText(homePage: Page, text: string): Locator {
  return toDoItems(homePage).filter({hasText: text}).first();
}

function toggleForItem(item: Locator): Locator {
  return item.getByRole('checkbox');
}

function destroyButtonForItem(item: Locator): Locator {
  return item.locator('button.destroy');
}

function getFooter(homePage: Page): Locator {
  return homePage.locator('footer.footer');
}

test('BAD EXAMPLE: Introducing race conditions', async ({ homePage }) => {
  // Expect a title "to contain" a substring.
  await expect(homePage).toHaveTitle(/TodoMVC/);

  const input: Locator = toDoInput(homePage);
  await expect(input).toBeVisible();
  
  await input.fill('task 1');
  await input.press('Enter');

  await expect(toDoItems(homePage)).toHaveCount(1);

  //bad example
  input.fill('This is a very long task - This is a very long task - This is a very long task - This is a very long task');
  input.press('Enter');

  await expect(toDoItems(homePage)).toHaveCount(2);

  await input.fill('task 3');
  await input.press('Enter');

  await expect(toDoItems(homePage)).toHaveCount(3);

  // explicit wait example
  await input.fill('Explicit Wait Example');
  await input.press('Enter');

  await homePage.waitForFunction(() => {
    return document.querySelectorAll('.todo-list > li').length === 4;
  })

  await expect(toDoItems(homePage)).toHaveCount(4);
})