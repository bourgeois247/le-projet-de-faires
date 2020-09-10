import TodoModel from '../TodoModel';
import { exist } from 'joi';

/**
 * TodoModel Specs
 */
describe('Todo Model', () => {
  let Todo;
  let createdTaskId;
  const originalLocalStorage = global.localStorage;

  beforeAll(() => {
    Todo = new TodoModel({
      DATABASE_NAME: 'Test'
    });
  });

  describe('Initialization', () => {
    it('should throw an exception if there\'s no config object provided', () => {
      expect(() => new TodoModel()).toThrow('A config object is required to initialize the TodoModel.');
    });

    it('should throw an exception if there\'s no DATABASE_NAME on the config object', () => {
      expect(() => new TodoModel({})).toThrow('Please specifify a database name: { DATABASE_NAME: <database name> } in the constructor.')
    });
  });

  describe('Get method(suite 1)', () => {
    it('should return undefined if the DB is empty', () => {
      expect(Todo.get(1)).toBeUndefined();
    });
  });

  describe('Create method', () => {
    it('should throw an error if no item or an empty string is passed', () => {
      expect(() => { Todo.create() })
        .toThrow(
          'You need to provide an item(at least 3 characters) to add to your todo list.' +
          ' The format is { title: <string>, description(optional): <string> }.'
        );
    });

    it('should throw an error if no item or an empty string is passed', () => {
      expect(() => { Todo.create() })
        .toThrow(
          'You need to provide an item(at least 3 characters) to add to your todo list.' +
          ' The format is { title: <string>, description(optional): <string> }.'
        );
    });

    it('should return an integer ID for the newly created task', () => {
      const createdTask = Todo.create({ title: 'My first task' });
      createdTaskId = createdTask.id;
      expect(createdTask).toHaveProperty('id');
      expect(createdTask).toHaveProperty('createdAt');
      expect(createdTask).toHaveProperty('title');

      expect(typeof createdTask.id === 'number').toBe(true);
    });
  });

  describe('Get method(suite 2)', () => {
    it('should throw an exception if no item ID is passed', () => {
      expect(() => { Todo.get() }).toThrow('Please specify the todo item ID to retrieve.');
    });

    it('should successfully retrieve an existing todo item', () => {
      const todoItem = Todo.get(createdTaskId);
      expect(todoItem).not.toBeNull();
      expect(todoItem.id).toBe(createdTaskId);
    });

    it('should return undefined for a key that does not exist', () => {
      expect(Todo.get('foreignKey')).toBeUndefined();
    });
  });

  describe('Update method', () => {
    it('should throw an error if no itemId is passed', () => {
      expect(() => { Todo.update(); }).toThrow('Please specify the todo item ID to update')
    });

    it('should throw an error if an invalid itemId is passed', () => {
      expect(() => { Todo.update('boj on the mic'); }).toThrow('Please specify a valid item ID to update')
    });

    it('should throw an error if no update object is passed', () => {
      expect(() => { Todo.update(createdTaskId); }).toThrow('You need to provide the data to update the item with');
    });

    it('should throw an error if the update object contains an "id" property', () => {
      expect(() => { Todo.update(createdTaskId, { id: 1 }); }).toThrow('You cannot edit the ID of a todo item, it\'s readonly');
    });

    it('should throw an error if the update object contains an invalid property', () => {
      expect(() => { Todo.update(createdTaskId, { 'cost': 3000 }); }).toThrow('The title and description properties are the only properties you can update.');
    });

    it('should update a given todo item', () => {
      const currentTask = Todo.get(createdTaskId);
      const updatedTitle = 'Nothing is ever promised tomorrow today';

      expect(currentTask).not.toContain(updatedTitle);

      const result = Todo.update(createdTaskId, { title: updatedTitle });
      expect(result.title).toContain(updatedTitle);

      const updatedCurrentTask = Todo.get(createdTaskId);
      expect(updatedCurrentTask.title).toContain(updatedTitle);
    });
  });

  describe('Delete method', () => {
    it('should throw an exception if no item ID is passed', () => {
      expect(() => { Todo.delete() }).toThrow('Please specify the todo item ID to delete.');
    });

    it('should successfully delete a todo item', () => {
      expect(Todo.get(createdTaskId)).not.toBeNull();

      expect(Todo.delete(createdTaskId)).toBe(true);
      expect(Todo.get(createdTaskId)).toBeUndefined();
    });

    it('should return "false" for an item that does not exist', () => {
      expect(Todo.delete('I definitely don\'t exist')).toBe(false);
    });
  });
});
