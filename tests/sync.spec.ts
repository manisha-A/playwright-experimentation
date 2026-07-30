import { test } from '@playwright/test';
import { ToDoPage } from './Pages/ToDoPage.ts';


test('BAD EXAMPLE: Introducing race conditions', async ({ page },testInfo) => {
  console.log(testInfo.config.metadata.environment);
  const todo = new ToDoPage(page);
  await todo.goto();
  // Expect a title "to contain" a substring.
  await todo.expectTitle(/TodoMVC/);

  await todo.addToDo('task 1');
  await todo.expectCount(1);

  //bad example
  await todo.addToDo('This is a very long task - This is a very long task - This is a very long task - This is a very long task');
  await todo.expectCount(2);

  await todo.addToDo('task 3');
  await todo.expectCount(3);

  // explicit wait example
  await todo.addToDo('Explicit Wait Example');
  await todo.expectCount(4);

  await todo.toggleTodo('Explicit Wait Example')
})

test('Skip only on: staging', async ({ page}, testInfo) => {
  console.log(testInfo.config.metadata.environment);
  if(testInfo.config.metadata.environment === 'staging'){
    test.skip('skip test');
  }
  const todo = new ToDoPage(page);
  await todo.goto();
  // Expect a title "to contain" a substring.
  await todo.expectTitle(/TodoMVC/);

  await todo.addToDo('A');
  await todo.expectCount(1);
})