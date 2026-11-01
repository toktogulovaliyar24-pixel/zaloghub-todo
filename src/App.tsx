import { useEffect, useState } from "react";
import './App.css';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');

    if (savedTasks) {
      return JSON.parse(savedTasks);
    }

    return [];
  });

  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    if (inputValue.trim() === '') return;

    const newTask: Task = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false
    };

    setTasks([...tasks, newTask]);
    setInputValue('');
  }

  function toggleTask(id: number) {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(newTasks);
  }

  function deleteTask(id: number) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  let filteredTasks = tasks;
  if (filter === 'active') {
    filteredTasks = tasks.filter((task) => !task.completed);
  }
  if (filter === 'completed') {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  return (
    <div className="container">
      <div className="todo-card">
        <h1>Мои задачи</h1>
        <div className="input-group">
          <input
            type="text"
            placeholder="Новая задача..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addTask();
              }
            }}
          />
          <button onClick={addTask}>
            Добавить
          </button>
        </div>
        <div className="filters">
          <button
            className={filter === 'all' ? 'selected' : ''}
            onClick={() => setFilter('all')}
          >
            Все
          </button>
          <button
            className={filter === 'active' ? 'selected' : ''}
            onClick={() => setFilter('active')}
          >
            Активные
          </button>
          <button
            className={filter === 'completed' ? 'selected' : ''}
            onClick={() => setFilter('completed')}
          >
            Выполненные
          </button>
        </div>
        <ul>
          {filteredTasks.length === 0 ? (
            <li className="empty">
              Задач пока нет
            </li>
          ) : (
            filteredTasks.map((task) => (
              <li
                key={task.id}
                className={task.completed ? 'completed' : ''}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />

                  {task.text}
                </label>
                <button onClick={() => deleteTask(task.id)}>
                  Удалить
                </button>
              </li>
            ))
          )}
        </ul>
        <p>Всего задач: {tasks.length}</p>
      </div>
    </div>
  );
}

export default App;
