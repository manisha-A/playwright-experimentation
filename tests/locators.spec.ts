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

test('can add and delete items from todo list', async ({ homePage }) => {
  // Expect a title "to contain" a substring.
  await expect(homePage).toHaveTitle(/TodoMVC/);

  const input: Locator = toDoInput(homePage);
  await expect(input).toBeVisible();

  const tasks = ['task 1', 'task 2', 'task 3'];
  for(const task of tasks){
    await input.fill(task);
    await input.press('Enter');
  }

  await expect(toDoItems(homePage)).toHaveCount(3);

  const itemA: Locator = itemByText(homePage, 'task 1');
  await expect(itemA).toBeVisible();

  const toggleA : Locator = toggleForItem(itemA);
  await toggleA.check();

  await expect(toggleA).toBeChecked();

  const completedItems: Locator = toDoItems(homePage).filter({has : homePage.getByRole('checkbox', {checked:true})});
  await expect(completedItems).toHaveCount(1);

  // second item
  const itemB: Locator = itemByText(homePage, 'task 2');
  await expect(itemB).toBeVisible();

  const toggleB : Locator = toggleForItem(itemB);

  await expect(toggleB).not.toBeChecked();

  await itemB.hover();
  const destroyB : Locator = destroyButtonForItem(itemB);

  await expect(destroyB).toBeVisible();
  await destroyB.click();

  await expect(toDoItems(homePage)).toHaveCount(2);
})

test('can navigate through active and completed urls', async ({ homePage }) => {
  // Expect a title "to contain" a substring.
  await expect(homePage).toHaveTitle(/TodoMVC/);

  const footer : Locator = getFooter(homePage);
  await expect(footer).toBeHidden;

  const input: Locator = toDoInput(homePage);
  await expect(input).toBeVisible();

  const tasks = ['task 1', 'task 2'];
  for(const task of tasks){
    await input.fill(task);
    await input.press('Enter');
  }

  await expect(toDoItems(homePage)).toHaveCount(2);
  await expect(footer).toBeVisible();

  const itemA: Locator = itemByText(homePage, 'task 1');
  await expect(itemA).toBeVisible();

  const toggleA : Locator = toggleForItem(itemA);
  await toggleA.check();

  await expect(toggleA).toBeChecked();
  await expect(itemA).toHaveClass('completed');

  const completedItems: Locator = toDoItems(homePage).filter({has : homePage.getByRole('checkbox', {checked:true})});
  await expect(completedItems).toHaveCount(1);

  // switch to Active link
  await homePage.getByRole('link',{name: 'Active'}).click();
  await expect(homePage).toHaveURL('https://demo.playwright.dev/todomvc/#/active');
  await expect(itemByText(homePage, 'task 1')).toHaveCount(0);

  // second item
  const itemB: Locator = itemByText(homePage, 'task 2');
  await expect(itemB).toBeVisible();

  await itemB.locator('label').dblclick();
  const editInput = itemB.locator('input.edit');
  await editInput.fill('task 2 - priority');
  await editInput.press('Enter');

  await expect(itemB.locator('label')).toHaveText('task 2 - priority');

  const toggleB : Locator = toggleForItem(itemB);

  await expect(toggleB).not.toBeChecked();

  await itemB.hover();
  const destroyB : Locator = destroyButtonForItem(itemB);

  await expect(destroyB).toBeVisible();
  await destroyB.click();

  await expect(toDoItems(homePage)).toHaveCount(0);

  // switch to completed
  await homePage.getByRole('link',{name: 'Completed'}).click();
  await expect(homePage).toHaveURL('https://demo.playwright.dev/todomvc/#/completed');
  await expect(itemByText(homePage, 'task 1')).toHaveCount(1);
})


