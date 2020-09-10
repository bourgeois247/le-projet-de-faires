import { JSDOM, VirtualConsole } from 'jsdom';
import simulant from 'jsdom-simulant';

let app;
let JSDOMWindow;
beforeAll(async () => {
  const virtualConsole = new VirtualConsole();

  virtualConsole.sendTo(console);

  JSDOMWindow = (await JSDOM.fromFile('index.html', { url: 'http://lechosesafaire.com', virtualConsole })).window;
  app = JSDOMWindow.document;
});

describe('Le projet de la liste de choses à faire', () => {
  describe('Summary counts', () => {
    it('should have total tasks count to be 0', () => {
      const totalTasksCount = app.querySelector('#total-tasks').textContent;
      expect(Number(totalTasksCount)).toBe(0);
    });

    it('should have completed tasks count to be 0', () => {
      const totalTasksCount = app.querySelector('#total-completed').textContent;
      expect(Number(totalTasksCount)).toBe(0);
    });

    it('should have favorite tasks count to be 0', () => {
      const totalTasksCount = app.querySelector('#total-favorites').textContent;
      expect(Number(totalTasksCount)).toBe(0);
    });
  });

  describe('Create task', () => {
    it('should create a new, regular task successfully', () => {
      const newTaskInput = app.querySelector('#create-task');
      const newTaskButton = app.querySelector('#save-new-task');
      newTaskInput.value = 'My first task!';
      expect(newTaskInput.value).toBe('My first task!');
      console.log(Object.values(JSDOMWindow.localStorage));
      expect(newTaskInput.value).toBe('');
    });
  });
});