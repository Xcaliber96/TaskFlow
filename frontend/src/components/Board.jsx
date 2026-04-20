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
    setSearchTasks("");
    setFilterPriority("All");
  }, [activeProjects, currentFilter]);

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
        priority: task.priority || "Low",
        dueDate: task.due_date || "",
        project: task.project,
      }));
    },
  });

  const filteredTasks = tasks.filter((task) => {
    if (searchTasks && !task.title.toLowerCase().includes(searchTasks.toLowerCase())) return false;
    if (filterPriority !== "All" && task.priority !== filterPriority) return false;
    if (currentFilter === "High Priority" && task.priority !== "High") return false;
    if (currentFilter === "My Tasks") return true;
    return true;
  });

  // Was missing — caused crash on every drag
  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, columnId }) => {
      const res = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: columnToStatus(columnId) }),
      });
      return res.json();
    },
    onMutate: async ({ taskId, columnId }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", activeProjects] });
      const previousTasks = queryClient.getQueryData(["tasks", activeProjects]);
      queryClient.setQueryData(["tasks", activeProjects], (old) =>
        (old || []).map((t) => (t.id === taskId ? { ...t, columnId } : t))
      );
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["tasks", activeProjects], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", activeProjects] });
    },
  });

  const updatePriorityMutation = useMutation({
    mutationFn: async ({ taskId, newPriority }) => {
      const res = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: newPriority }),
      });
      return res.json();
    },
    onMutate: async ({ taskId, newPriority }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", activeProjects] });
      const previousTasks = queryClient.getQueryData(["tasks", activeProjects]);
      queryClient.setQueryData(["tasks", activeProjects], (old) =>
        (old || []).map((t) => (t.id === taskId ? { ...t, priority: newPriority } : t))
      );
      return { previousTasks };
    },
    onError: (err, variables, context) => {
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
    updatePriorityMutation.mutate({ taskId, newPriority });
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

    if (activeId.startsWith("task-")) {
      const activeTaskId = parseInt(activeId.replace("task-", ""));
      const currentTasks = queryClient.getQueryData(["tasks", activeProjects]) || [];
      const activeTask = currentTasks.find((t) => t.id === activeTaskId);

      if (activeTask) {
        updateTaskMutation.mutate({
          taskId: activeTaskId,
          columnId: activeTask.columnId,
        });

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

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.columnId === 3).length;
  const isFiltered = currentFilter !== "All" || searchTasks || filterPriority !== "All";

  return (
    <div className="flex min-h-screen bg-[#0E0F11] text-zinc-100 font-sans flex-col">
      <header className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div>
            <h1 className="text-base font-semibold text-zinc-100 leading-tight">{activeProjects}</h1>
            <p className="text-[11px] text-zinc-600 mt-0.5">
              {totalTasks} task{totalTasks !== 1 ? "s" : ""} · {doneTasks} done
              {isFiltered && <span className="ml-1.5 text-indigo-400">· filtered</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search tasks..."
              value={searchTasks}
              onChange={(e) => setSearchTasks(e.target.value)}
              className="pl-8 pr-8 py-1.5 text-xs bg-white/[0.04] border border-white/[0.08] rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all w-48"
            />
            {searchTasks && (
              <button
                onClick={() => setSearchTasks("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen((p) => !p)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border transition-all ${
                filterPriority !== "All"
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                  : "bg-white/[0.04] border-white/[0.08] text-zinc-500 hover:text-zinc-300 hover:border-white/20"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              {filterPriority === "All" ? "Priority" : filterPriority}
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-1.5 w-28 bg-[#141518] border border-white/10 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                  {["All", "Low", "Medium", "High"].map((level) => (
                    <button
                      key={level}
                      onClick={() => {
                        setFilterPriority(level);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                        filterPriority === level
                          ? "bg-indigo-500/10 text-indigo-400"
                          : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-1 text-[10px] text-zinc-700 border border-white/[0.05] rounded px-1.5 py-1">
            <kbd className="font-mono">/</kbd>
            <span>search</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-5 items-start w-max">
          <DndContext
            collisionDetection={closestCorners}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={columns.map((col) => `column-${col.id}`)} strategy={horizontalListSortingStrategy}>
              {columns.map((column) => {
                const columnTasks = filteredTasks.filter((task) => task.columnId === column.id);
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
  );
}

export default Board;