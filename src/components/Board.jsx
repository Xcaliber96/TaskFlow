import Column from "./Column";
import { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

function Board() {
  const initialColumns = [
    { id: 1, title: "To Do" },
    { id: 2, title: "In Progress" },
    { id: 3, title: "Done" },
  ];

  const [columns] = useState(initialColumns);

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");

    return savedTasks
      ? JSON.parse(savedTasks)
      : [
          { id: 1, title: "Learn React", columnId: 1, priority: "Low" },
          { id: 2, title: "Build Kanban", columnId: 1, priority: "Medium" },
          { id: 3, title: "Push to GitHub", columnId: 2, priority: "High" },
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
      priority: "Low",
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(taskId) {
    setTasks(tasks.filter((task) => task.id !== taskId));
  }

  function moveTask(taskId) {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, columnId: task.columnId === 3 ? 1 : task.columnId + 1 }
        : task
    );

    setTasks(updatedTasks);
  }

  function editTask(taskId, newTitle) {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, title: newTitle } : task
    );

    setTasks(updatedTasks);
  }

  function updatePriority(taskId, newPriority) {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, priority: newPriority } : task
    );

    setTasks(updatedTasks);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTaskId = parseInt(activeId.replace("task-", ""));

    if (overId.startsWith("task-")) {
      const oldIndex = tasks.findIndex((task) => `task-${task.id}` === activeId);
      const newIndex = tasks.findIndex((task) => `task-${task.id}` === overId);

      if (oldIndex !== newIndex) {
        setTasks(arrayMove(tasks, oldIndex, newIndex));
      }

      return;
    }

    if (overId.startsWith("column-")) {
      const newColumnId = parseInt(overId.replace("column-", ""));

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === activeTaskId
            ? { ...task, columnId: newColumnId }
            : task
        )
      );
    }
  }

  return (
<div
    style={{
      minHeight: "100vh",
      width: "100%", 
      background: "#121212",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",   
      paddingTop: "60px",
      overflowX: "auto"        
    }}
  >
    <div
      style={{
        display: "flex",
        gap: "40px",
        padding: "0 20px",    
        justifyContent: "center", 
        width: "max-content"      
      }}
      >
        <DndContext onDragEnd={handleDragEnd}>
          {columns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter((task) => task.columnId === column.id)}
              addTask={addTask}
              deleteTask={deleteTask}
              moveTask={moveTask}
              editTask={editTask}
              updatePriority={updatePriority}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}

export default Board;