/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';

enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

enum ErrorMessage {
  Load = 'Unable to load todos',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  EmptyTitle = 'Title should not be empty',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [tempTodoId, setTempTodoId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    const id = Date.now();
    const newTodo: Todo = {
      id,
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    setTempTodo(newTodo);
    setTempTodoId(id);
    setIsLoading(true);

    addTodo(trimmed)
      .then(createdTodo => {
        setTodos(prev => [...prev, createdTodo]);
        setTitle('');
      })
      .catch(() => setErrorMessage(ErrorMessage.Add))
      .finally(() => {
        setTimeout(() => setTempTodo(null), 700);
      });
  };

  const handleDelete = (todoId: number) => {
    setIsLoading(true);
    deleteTodo(todoId)
      .then(() => setTodos(prev => prev.filter(t => t.id !== todoId)))
      .catch(() => setErrorMessage(ErrorMessage.Delete))
      .finally(() => setIsLoading(false));
  };

  const handleClearCompleted = () => {
    const completed = todos.filter(t => t.completed);

    if (completed.length === 0) {
      return;
    }

    Promise.allSettled(completed.map(t => deleteTodo(t.id))).then(results => {
      const hasError = results.some(r => r.status === 'rejected');

      if (hasError) {
        setErrorMessage(ErrorMessage.Delete);
      }

      setTodos(prev => prev.filter(t => !t.completed));
    });
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={`todoapp__toggle-all ${
              todos.every(t => t.completed) ? 'active' : ''
            }`}
            data-cy="ToggleAllButton"
            disabled={isLoading}
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {/* This is a completed todo */}
            {filteredTodos.map(todo => (
              <div
                key={todo.id}
                data-cy="Todo"
                className={`todo ${todo.completed ? 'completed' : ''}`}
              >
                <input
                  id={`todo-${todo.id}`}
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  readOnly
                />
                <label
                  className="todo__status-label"
                  htmlFor={`todo-${todo.id}`}
                >
                  <span className="visually-hidden">Toggle todo</span>
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDelete(todo.id)}
                  disabled={isLoading}
                >
                  ×
                </button>
              </div>
            ))}

            {tempTodo && isLoading && (
              <div data-cy="Todo" className="todo">
                <input
                  id={`temp-todo-${tempTodoId}`}
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={false}
                  readOnly
                />

                <label
                  className="todo__status-label"
                  htmlFor={`temp-todo-${tempTodoId}`}
                >
                  <span className="visually-hidden">Toggle todo</span>
                </label>
                <span data-cy="TodoTitle" className="todo__title">
                  {tempTodo.title}
                </span>

                <div data-cy="TodoLoader" className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  disabled
                >
                  ×
                </button>
              </div>
            )}
          </section>
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(t => !t.completed).length} items left
            </span>
            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === Filter.All ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(Filter.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === Filter.Active ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(Filter.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === Filter.Completed ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(Filter.Completed)}
              >
                Completed
              </a>
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={!todos.some(t => t.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          errorMessage ? '' : 'hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
