import { TodoSingleton as Todo } from './TodoModel';

/**
 * Initialize pertinent values
 */
let allTodos = Todo.getAll();
let totalCompleted = 0;
let totalFavorites = 0;

const statusBar = document.querySelector('.barlevel');
const todoInput = document.querySelector('#create-task');
const validationErrorContainer = document.querySelector('#validation-error');
validationErrorContainer.classList.add('hide');

// get todo item template
const todoItemTemplate = document.querySelector('.task.template');
todoItemTemplate.classList.remove('template');
todoItemTemplate.remove();

/**
 * Append a new todo item to the appropriate list of todos
 * 
 * @param {object} todo item { title: <string>, details: <string>, isFavorite: Boolean, done: Boolean }
 * @param {string} listType either regulars | faves
 */
const appendToList = (todo, listType = 'regulars') => {
  const list = document.querySelector(`.${listType}`);
  const clonedTemplate = todoItemTemplate.cloneNode(true);
  clonedTemplate.querySelector('.title').innerHTML = todo.title;
  clonedTemplate.setAttribute('id', todo.id);

  if (todo.isDone) {
    clonedTemplate.classList.add('done');
  }

  list.append(clonedTemplate);
};

/**
 * Update Counts
 * 
 * @param {string} selector CSS selector
 * @param {number} value
 */
const updateCount = (selector, value) => {
  const countCountainer = document.querySelector(selector);
  countCountainer.innerHTML = value;
};

/**
 * Update status bar
 */
const updateStatusBar = () => {
  const completionPercentage = (totalCompleted / Todo.getAll().length) * 100;
  statusBar.setAttribute('style', `width: ${completionPercentage}%`);
};

/**
 * Create a todo item
 */
const createTodoItem = () => {
  // get the typed string
  const todoTitle = todoInput.value;

  if (todoTitle.length < 3) {
    validationErrorContainer.innerHTML = 'You have to provide a valid task that\'s longer than two(2) characters';
    validationErrorContainer.classList.remove('hide');
  } else {
    // clear and hide if they're coming from correcting a validation error
    validationErrorContainer.innerHTML = '';
    validationErrorContainer.classList.add('hide');

    try {
      const newTodoItem = Todo.create({ title: todoTitle });
      todoInput.value = '';

      // append to view
      appendToList(newTodoItem);
      updateCount('#total-tasks', Todo.getAll().length);
    } catch (err) {
      console.log(err.message);
    }
  }
}

/**
 * Favorite a todo item
 * 
 * @param {object} todoItem
 * @param {object} todoItemHTMLElement
 */
const favoriteTodoItem = (todoItem, todoItemHTMLElement) => {
  if (!todoItem.isFavorite) {
    document.querySelector('.faves').append(todoItemHTMLElement);

    // update persisted list
    Todo.update(todoItem.id, { isFavorite: true });
    totalFavorites++;

  } else {
    document.querySelector('.regulars').append(todoItemHTMLElement);

    // update persisted list
    Todo.update(todoItem.id, { isFavorite: false });
    totalFavorites--;
  }

  updateCount('#total-favorites', totalFavorites);
};

/**
 * Delete a todo item
 * 
 * @param {string} todoItemId
 * @param {HTMLElement} todoItemHTMLElement
 */
const deleteTodoItem = (todoItemId, todoItemHTMLElement) => {
  todoItemHTMLElement.remove();
  Todo.delete(todoItemId)
  updateCount('#total-tasks', Todo.getAll().length);
}

/**
 * Toggle done status of a todoItem
 * 
 * @param {object} todoItem
 * @param {HTMLElement} todoItemHTMLElement
 */
const toggleDone = (todoItem, todoItemHTMLElement) => {
  Todo.update(todoItem.id, { isDone: !todoItem.isDone });
  totalCompleted = todoItem.isDone ? --totalCompleted : ++totalCompleted;

  todoItem.isDone
    ? todoItemHTMLElement.classList.remove('done')
    : todoItemHTMLElement.classList.add('done');

  updateCount('#total-completed', totalCompleted);
  updateStatusBar();
};

// view all todos
allTodos.forEach((todo) => {
  if (todo.isDone) {
    totalCompleted++;
  }

  if (todo.isFavorite) {
    totalFavorites++;
  }

  const listType = todo.isFavorite ? 'faves' : 'regulars';
  appendToList(todo, listType);
});

// update counts
updateCount('#total-tasks', allTodos.length);
updateCount('#total-completed', totalCompleted);
updateCount('#total-favorites', totalFavorites);
updateStatusBar();

/**********************************************
 * Implement Handlers
 **********************************************/

/**
 * Create task handler
 */
todoInput.addEventListener('keyup', ($e) => {
  if ($e.key.toLowerCase() === 'enter') {
    createTodoItem();
  }
});

/**
 * Task List Handlers
 * Leverage event delegation
 */
document.querySelector('#task-list').addEventListener('click', ($e) => {
  const targetElement = $e.path[1];
  let todoItemElement = $e.path[3];
  const todoId = todoItemElement.getAttribute('id');
  let todoItem = Todo.get(`${todoId}`);

  if (targetElement.classList.contains('favorite')) {
    favoriteTodoItem(todoItem, todoItemElement);
  }

  if (targetElement.classList.contains('delete')) {
    deleteTodoItem(todoId, todoItemElement);
  }

  if ($e.path[0].classList.contains('checkbox')) {
    todoItemElement = $e.path[1];
    todoItem = Todo.get(todoItemElement.getAttribute('id'));
    toggleDone(todoItem, todoItemElement);
  }

  if (targetElement.classList.contains('edit')) {
    alert('Edit is still a WIP!');
  }

  $e.preventDefault();
});