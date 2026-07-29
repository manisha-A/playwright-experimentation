import { expect, Locator, Page } from '@playwright/test';

export class ToDoPage {
    readonly page: Page;
    readonly input: Locator;
    readonly items: Locator;

    constructor(page: Page){
        this.page = page;
        this.input = page.getByPlaceholder('What needs to be done?');
        this.items = page.locator('.todo-list > li');
    }

    async goto(): Promise<void>{
        await this.page.goto('https://demo.playwright.dev/todomvc/#/');
    }

    async addToDo(textInput: string): Promise<void>{
        await this.input.fill(textInput);
        await this.input.press('Enter');
    }

    getItemByText(text: string): Locator {
        return this.items.filter({ hasText: text }).first();
    }

    async toggleTodo(text: string): Promise<void> {
    const item = this.getItemByText(text);
    await item.getByRole('checkbox').check();
}

  async expectCount(count: number): Promise<void> {
    await expect(this.items).toHaveCount(count);
  }

  async expectTitle(pageTitle: RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(pageTitle);
  }
}