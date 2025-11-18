import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (id: number) => void;
  deletingTodoId: number | null;
  onToggle: (id: number) => void;
  onUpdate: (id: number, title: string) => void;
  isTemp?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  deletingTodoId,
  onToggle,
  isTemp = false,
}) => {
  const isDeleting = isTemp || deletingTodoId === todo.id;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <input
        id={`todo-${todo.id}`}
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        disabled={isTemp}
        onChange={() => onToggle(todo.id)}
        readOnly
      />

      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <span className="visually-hidden">Toggle todo</span>
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      {!isTemp && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          disabled={isLoading}
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', { 'is-active': isDeleting })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
