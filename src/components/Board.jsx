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

  const [searchTasks, setSearchTasks] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");

  const [columns] = useState(initialColumns);

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");

    return savedTasks
      ? JSON.parse(savedTasks)
      : [
          { id: 1, title: "Learn React", columnId: 1, priority: "Low", dueDate: "" },
          { id: 2, title: "Build Kanban", columnId: 1, priority: "Medium", dueDate: "" },
          { id: 3, title: "Push to GitHub", columnId: 2, priority: "High", dueDate: "" },
        ];
  });
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(columnId, title, dueDate) {
    if (!title.trim()) return;

    const newTask = {
      id: Date.now(),
      title,
      columnId,
      priority: "Low",
      dueDate,
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
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    task => task.columnId === 3
  ).length;
  
  const progressPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
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
      }}
    >
      <div
        style={{
          width:"400px",
          marginBottom: "20px",
          
        }}
      >
        <div
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#4f46e5",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Progress: {completedTasks} / {totalTasks} ({progressPercentage}%)

        </div>
        <div
        style={{
          height: "10px",
          width: "100%",
          backgroundColor: "#333",
          borderRadius: "5px",
          overflow: "hidden",
        }}
        >
          <div
            style={{
              width: `${progressPercentage}%`,
              height: "100%",
              backgroundColor: "#4f46e5",
            }}
          />

        </div>

      </div>
     
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTasks}
          onChange={(e) => setSearchTasks(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #333",
            background: "#1e1e1e",
            color: "white",
          }}
        />

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            background: "#1e1e1e",
            color: "white",
          }}
        >
          <option value="All">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div
        style={{
          display: "flex",
          gap: "40px",
          padding: "0 20px",
          justifyContent: "flex-start",
          width: "max-content",
          overflowX: "auto",
        }}
      >
        <DndContext onDragEnd={handleDragEnd}>
          {columns.map((column) => {

            const columnTasks = tasks
              .filter((task) => task.columnId === column.id)
              .filter((task) =>
                task.title.toLowerCase().includes(searchTasks.toLowerCase())
              )
              .filter((task) =>
                filterPriority === "All"
                  ? true
                  : task.priority === filterPriority
              );

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
                updatePriority={updatePriority}
              />
            );
          })}
        </DndContext>
      </div>
    </div>
  );
}

export default Board;