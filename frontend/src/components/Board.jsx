import Column from "./Column";
import { useState, useEffect, useRef } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function Board({ activeProjects, currentFilter }) {
  const queryClient = useQueryClient();
  const initialColumns = [
    { id: 1, title: "To Do" },
    { id: 2, title: "In Progress" },
    { id: 3, title: "Done" },
  ];

  const searchInputRef = useRef(null);
  const [searchTasks, setSearchTasks] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [columns, setColumns] = useState(initialColumns);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        if (e.key === "Escape") {
          e.target.blur();
          setSearchTasks("");
        }
        return;
      }
      if (e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        setIsDropdownOpen((prev) => !prev);
      }
      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        document.getElementById("add-task-btn-1")?.click();
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedTaskId) {
          e.preventDefault();
          deleteTask(selectedTaskId);
        }
      }
      if (e.key === "Escape") {
        setSelectedTaskId(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedTaskId]);

  function columnToStatus(columnId) {
    if (columnId === 1) return "todo";
    if (columnId === 2) return "in-progress";
    return "done";
  }

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", activeProjects],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/tasks/?project=${activeProjects}`);
      const data = await res.json();
      return data.map((task) => ({
        id: task.id,
        title: task.title,
        columnId: task.status === "todo" ? 1 : task.status === "in-progress" ? 2 : 3,
        priority: task.priority || "Low", // Added fallback for priority
        dueDate: "",
        project: task.project,
      }));
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, columnId }) => {
      const res = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: columnToStatus(columnId) }),
      });
      return res.json();
    },
    onMutate: async (newStatusData) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", activeProjects] });
      const previousTasks = queryClient.getQueryData(["tasks", activeProjects]);
      queryClient.setQueryData(["tasks", activeProjects], (old) => {
        if (!old) return [];
        return old.map((t) =>
          t.id === newStatusData.taskId ? { ...t, columnId: newStatusData.columnId } : t
        );
      });
      return { previousTasks };
    },
    onError: (err, newStatusData, context) => {
      queryClient.setQueryData(["tasks", activeProjects], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", activeProjects] });
    },
  });

  const addTaskMutation = useMutation({
    mutationFn: async ({ columnId, title, dueDate }) => {
      const res = await fetch("http://localhost:8000/tasks/", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          status: columnToStatus(columnId),
          project: activeProjects,
        }),
      });
      const data = await res.json();
      return { data, columnId, dueDate };
    },
    onSuccess: ({ data, columnId, dueDate }) => {
      const newTask = {
        id: data.id,
        title: data.title,
        columnId,
        priority: "Low",
        dueDate,
        project: activeProjects,
      };
      queryClient.setQueryData(["tasks", activeProjects], (old) => [...(old || []), newTask]);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      await fetch(`http://localhost:8000/tasks/${taskId}`, { method: "DELETE" });
      return taskId;
    },
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", activeProjects] });
      const previousTasks = queryClient.getQueryData(["tasks", activeProjects]);
      queryClient.setQueryData(["tasks", activeProjects], (old) =>
        (old || []).filter((task) => task.id !== taskId)
      );
      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      queryClient.setQueryData(["tasks", activeProjects], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", activeProjects] });
    },
  });

  const editTaskMutation = useMutation({
    mutationFn: async ({ taskId, newTitle }) => {
      const res = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      return res.json();
    },
    onMutate: async ({ taskId, newTitle }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", activeProjects] });
      const previousTasks = queryClient.getQueryData(["tasks", activeProjects]);
      queryClient.setQueryData(["tasks", activeProjects], (old) => {
        if (!old) return [];
        return old.map((t) => (t.id === taskId ? { ...t, title: newTitle } : t));
      });
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["tasks", activeProjects], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", activeProjects] });
      window.dispatchEvent(new Event("tasksUpdated"));
    },
  });

  function addTask(columnId, title, dueDate) {
    if (!title.trim()) return;
    addTaskMutation.mutate({ columnId, title, dueDate });
  }

  function deleteTask(taskId) {
    deleteTaskMutation.mutate(taskId);
    if (selectedTaskId === taskId) setSelectedTaskId(null);
  }

  function editTask(taskId, newTitle) {
    editTaskMutation.mutate({ taskId, newTitle });
  }

  function updatePriority(taskId, newPriority) {
    queryClient.setQueryData(["tasks", activeProjects], (old) => {
      if (!old) return [];
      return old.map((task) =>
        task.id === taskId ? { ...task, priority: newPriority } : task
      );
    });
  }

  function handleDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const isActiveTask = activeId.startsWith("task-");
    const isOverTask = overId.startsWith("task-");
    const isOverColumn = overId.startsWith("column-");

    if (!isActiveTask) return;

    const activeTaskId = parseInt(activeId.replace("task-", ""));

    queryClient.setQueryData(["tasks", activeProjects], (prevTasks) => {
      if (!prevTasks) return [];
      const activeIndex = prevTasks.findIndex((t) => t.id === activeTaskId);
      if (activeIndex === -1) return prevTasks;

      const activeTask = prevTasks[activeIndex];

      if (isOverTask) {
        const overTaskId = parseInt(overId.replace("task-", ""));
        const overIndex = prevTasks.findIndex((t) => t.id === overTaskId);
        if (overIndex === -1) return prevTasks;

        const overTask = prevTasks[overIndex];

        if (activeTask.columnId !== overTask.columnId) {
          const newTasks = [...prevTasks];
          newTasks[activeIndex] = { ...activeTask, columnId: overTask.columnId };
          return arrayMove(newTasks, activeIndex, overIndex);
        }
      }

      if (isOverColumn) {
        const overColumnId = parseInt(overId.replace("column-", ""));
        if (activeTask.columnId !== overColumnId) {
          const newTasks = [...prevTasks];
          newTasks[activeIndex] = { ...activeTask, columnId: overColumnId };
          return newTasks;
        }
      }

      return prevTasks;
    });
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // 1. Column Dragging
    if (activeId.startsWith("column-") && overId.startsWith("column-")) {
      if (activeId !== overId) {
        setColumns((prevColumns) => {
          const oldIndex = prevColumns.findIndex((col) => `column-${col.id}` === activeId);
          const newIndex = prevColumns.findIndex((col) => `column-${col.id}` === overId);
          return arrayMove(prevColumns, oldIndex, newIndex);
        });
      }
      return;
    }

    // 2. Task Dragging
    if (activeId.startsWith("task-")) {
      const activeTaskId = parseInt(activeId.replace("task-", ""));
      
      const currentTasks = queryClient.getQueryData(["tasks", activeProjects]) || [];
      const activeTask = currentTasks.find((t) => t.id === activeTaskId);

      if (activeTask) {
        console.log(`✅ DRAG END: Saving Task ${activeTaskId} to Column ${activeTask.columnId}`);
        
        // Always send the latest state to the database!
        updateTaskMutation.mutate({ 
          taskId: activeTaskId, 
          columnId: activeTask.columnId 
        });

        // Handle visual reordering if dropped on another task
        if (overId.startsWith("task-")) {
          const overTaskId = parseInt(overId.replace("task-", ""));
          queryClient.setQueryData(["tasks", activeProjects], (old) => {
            if (!old) return [];
            const oldIndex = old.findIndex((t) => t.id === activeTaskId);
            const newIndex = old.findIndex((t) => t.id === overTaskId);
            return arrayMove(old, oldIndex, newIndex);
          });
        }
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0E0F11] text-zinc-100 font-sans">
      <div className="flex-1 flex flex-col">
        <header className="px-8 py-6 border-b border-white/5">
          <h1 className="text-xl">TaskFlow</h1>
        </header>

        <main className="flex-1 overflow-x-auto p-8">
          <div className="flex gap-6 items-start w-max">
            <DndContext
              collisionDetection={closestCorners}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={columns.map((col) => `column-${col.id}`)} strategy={horizontalListSortingStrategy}>
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
                      editTask={editTask}
                      updatePriority={updatePriority}
                      selectedTaskId={selectedTaskId}
                      setSelectedTaskId={setSelectedTaskId}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Board;