/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { getFilteredTodos } from './services/getFilteredTodos';

const USER_ID = 87;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Status>(Status.All);

  const filteredTodos = getFilteredTodos(filter, todos);
  const activeTodosCount = todos.reduce((acc, cur) => {
    if (!cur.completed) {
      return acc + 1;
    }

    return acc;
  }, 0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Error');
        timeout = setTimeout(() => {
          setErrorMessage('');
          clearInterval(timeout);
        }, 3000);
      });

    return () => {
      clearInterval(timeout);
    };
  }, []);

  const handleCloseError = () => {
    setErrorMessage('');
  };

  const handleFilter = (status: Status) => {
    setFilter(status);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        {!!todos.length && (
          <section className="todoapp__main" data-cy="TodoList">
            <ul className="todolist">
              {filteredTodos.map(({ title, completed, id }) => (
                <li
                  data-cy="Todo"
                  className={cn('todo', { completed })}
                  key={id}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={completed}
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {title}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                  >
                    ×
                  </button>

                  <div data-cy="TodoLoader" className="modal overlay">
                    <div
                      className="modal-background has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodosCount} items left`}
            </span>

            {/* Active filter should have a 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link',
                  { selected: filter === Status.All })}
                data-cy="FilterLinkAll"
                onClick={() => handleFilter(Status.All)}
              >
                {Status.All}
              </a>

              <a
                href="#/active"
                className={cn('filter__link',
                  { selected: filter === Status.Active })}
                data-cy="FilterLinkActive"
                onClick={() => handleFilter(Status.Active)}
              >
                {Status.Active}
              </a>

              <a
                href="#/completed"
                className={cn('filter__link',
                  { selected: filter === Status.Completed })}
                data-cy="FilterLinkCompleted"
                onClick={() => handleFilter(Status.Completed)}
              >
                {Status.Completed}
              </a>
            </nav>

            {/* don't show this button if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleCloseError}
        />
        {/* show only one message at a time */}
        Unable to load todos
        {/* <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
