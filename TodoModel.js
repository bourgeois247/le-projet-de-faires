import Joi from 'joi';

/**
 * Global config
 * 
 * This will ideally be set as an enviromental variable
 */
const _config = {
  DATABASE_NAME: process.env.DATABASE_NAME || 'TODO_DEV'
}

/**
 * Todo Model
 * 
 * @param {object} config
 */
class TodoModel {
  config;
  DB;
  todoSchema = Joi.object({
    title: Joi.string().required().min(3),
    details: Joi.string()
  });

  constructor(config) {
    if (!config) {
      throw new Error('A config object is required to initialize the TodoModel.');
    }

    if (!config.DATABASE_NAME) {
      throw new Error('Please specifify a database name: { DATABASE_NAME: <database name> } in the constructor.')
    }

    this.config = config;

    this.DB = window.localStorage.getItem(this.config.DATABASE_NAME);

    if (!this.DB) {
      this.DB = '{}';
      window.localStorage.setItem(this.config.DATABASE_NAME, this.DB);
    }

    this.DB = JSON.parse(this.DB);
  }

  /**
   * Create a todo item
   * 
   * @param {object} item with shape { title: '', description: ''}. The title field is required.
   */
  create(item) {
    const validatedItem = this.todoSchema.validate(item);

    if (!validatedItem.value || validatedItem.error) {
      throw new Error(
        'You need to provide an item(at least 3 characters) to add to your todo list.' +
        ' The format is { title: <string>, description(optional): <string> }.'
      );
    }

    const itemId = Date.now();
    const newTodo = { id: itemId, createdAt: (new Date()).toLocaleDateString(), ...item };

    this.DB = { ...this.DB, [itemId]: newTodo };
    window.localStorage.setItem(this.config.DATABASE_NAME, JSON.stringify(this.DB));

    return newTodo;
  }

  /**
   * Delete a todo item
   * 
   * @param {number} itemId
   */
  delete(itemId) {
    if (!itemId) {
      throw new Error('Please specify the todo item ID to delete.');
    }

    if (!this.DB[itemId]) {
      return false;
    }

    delete this.DB[itemId];
    window.localStorage.setItem(this.config.DATABASE_NAME, JSON.stringify(this.DB));

    return true;
  }

  /**
   * Update a todo item.
   * PS: You can't update the ID of a todo item
   * 
   * @param {number} itemId
   * @param {string} updatedItem
   */
  update(itemId, updatedItem) {
    if (!itemId) {
      throw new Error('Please specify the todo item ID to update.');
    }

    if (!this.DB[itemId]) {
      throw new Error('Please specify a valid item ID to update');
    }

    if (!updatedItem) {
      throw new Error('You need to provide the data to update the item with.');
    }

    if (updatedItem['id'] !== undefined) {
      throw new Error('You cannot edit the ID of a todo item, it\'s readonly.');
    }

    const validatedUpdateItem = this.todoSchema.validate(updatedItem);

    if (!validatedUpdateItem || validatedUpdateItem.error) {
      throw new Error('The title and description properties are the only properties you can update.');
    }

    this.DB[itemId] = { ...this.DB[itemId], ...updatedItem };
    updatedItem = this.DB[itemId];
    window.localStorage.setItem(this.config.DATABASE_NAME, JSON.stringify(this.DB));

    return updatedItem;
  }

  /**
   * Get a todo item
   * 
   * @param {number} itemId
   */
  get(itemId) {
    if (!itemId) {
      throw new Error('Please specify the todo item ID to retrieve.');
    }

    return this.DB[itemId];
  }
}

export default TodoModel;
export const TodoSingleton = new TodoModel(_config);
