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
  tempTodoId: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  isLoading,
  onToggle,
  onUpdate,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <ul>
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
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          onUpdate={onUpdate}
          isLoading={isLoading}
          deletingTodoId={null}
        />
      ))}
    </ul>
  </section>
);
