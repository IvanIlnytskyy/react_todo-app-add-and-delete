import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isLoading: boolean;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onUpdate: (id: number, title: string) => void;
  deletingTodoId: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  isLoading,
  onToggle,
  onUpdate,
  deletingTodoId,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          onUpdate={onUpdate}
          isLoading={isLoading}
          deletingTodoId={deletingTodoId}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key="temp"
          todo={tempTodo}
          onDelete={() => {}}
          onToggle={() => {}}
          onUpdate={() => {}}
          isLoading={true}
          isTemp={true}
          deletingTodoId={null}
        />
      )}
    </ul>
  </section>
);
