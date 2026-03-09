import Column from "./Column";
import { useState, useEffect, use } from "react";


function Board() {
  const initialColumns = [
    { id: 1, title: "To Do" },
    { id: 2, title: "In Progress" },
    { id: 3, title: "Done" },
  ];

  const [columns, setColumns] = useState(initialColumns);

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks)
      : [
          { id: 1, title: "Learn React", columnId: 1 },
          { id: 2, title: "Build Kanban", columnId: 1 },
          { id: 3, title: "Push to GitHub", columnId: 2 },
        ];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  function addTask(columnId, title) {
    if (!title.trim()) return;
    const newTask = {
      id: Date.now(),
      title,
      columnId,
    };

    setTasks([...tasks, newTask]);
  }
  function deleteTask(taskId) {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  }

  function moveTask(taskId) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          columnId: task.columnId === 3 ? 1 : task.columnId + 1,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  }
  function editTask(taskId, newTitle) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          title: newTitle,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  return (
    <div
      className="board"
      style={{ display: "flex", gap: "50px", padding: "35px" }}
    >
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.columnId === column.id);

        return (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={columnTasks}
            addTask={addTask}
            deleteTask={deleteTask}
            moveTask={moveTask}
            editTask={editTask}
          />
        );
      })}
    </div>
  );
}

export default Board;
