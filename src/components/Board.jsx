import Column from "./Column";
import { useState, useEffect, use } from "react";
import { DndContext } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";


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
      priority: "",
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
  function handleDragEnd(event) {
    const { active, over } = event;
  
    if (!over) return;
  
    const activeId = active.id;
    const overId = over.id;
  
    const activeTaskId = parseInt(activeId.replace("task-", ""));
  
    if (overId.startsWith("task-")) {
      const oldIndex = tasks.findIndex(task => `task-${task.id}` === activeId);
      const newIndex = tasks.findIndex(task => `task-${task.id}` === overId);
  
      if (oldIndex !== newIndex) {
        setTasks(arrayMove(tasks, oldIndex, newIndex));
      }
  
      return;
    }
  
    if (overId.startsWith("column-")) {
      const newColumnId = parseInt(overId.replace("column-", ""));
  
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === activeTaskId
            ? { ...task, columnId: newColumnId }
            : task
        )
      );
    }
  }

  function updatePriority(taskId, newPriority) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          priority: newPriority,
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
      <DndContext onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: "20px" }}>
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
        </div>
      </DndContext>
    </div>
  );
}

export default Board;
