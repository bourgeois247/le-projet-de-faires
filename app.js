import { TodoSingleton } from './TodoModel';

// add event listener to the input for creating tasks
const todoInput = document.querySelector('#create-task');
const validationErrorContainer = document.querySelector('#validation-error');
validationErrorContainer.classList.add('hide');

todoInput.addEventListener('keyup', ($e) => {
  if ($e.key.toLowerCase() === 'enter') {
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
        TodoSingleton.create({ title: todoTitle });
        todoInput.value = '';
      } catch (err) {
        console.log(err.message);
      }
    }
  }
});

  // otherwise show a validation error 

// if there are no tasks available, hide the entire list
// once a task is added, reveal only the regular task list
  // increment the total task count
  // increment task completed count

// if a task is favorited, remove it from the favorite list and append to the regualar list