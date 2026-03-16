
import Column from "./Column";
import { useState, useEffect, useRef } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";

function Board({activeProjects, tasks, setTasks}) {
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

  function addTask(columnId, title, dueDate) {
    if (!title.trim()) return;
    const newTask = {
      id: Date.now(),
      title,
      columnId,
      priority: "Low",
      dueDate,
      project: activeProjects,
    };
    setTasks((prev) => [...prev, newTask]);
  }

  
  function deleteTask(taskId) {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    if (selectedTaskId === taskId) setSelectedTaskId(null);
  }

  function editTask(taskId, newTitle) {
    setTasks((prev) => prev.map((task) =>
      task.id === taskId ? { ...task, title: newTitle } : task
    ));
  }

  function updatePriority(taskId, newPriority) {
    setTasks((prev) => prev.map((task) =>
      task.id === taskId ? { ...task, priority: newPriority } : task
    ));
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

    setTasks((prevTasks) => {
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

    if (activeId !== overId && activeId.startsWith("task-") && overId.startsWith("task-")) {
      const activeTaskId = parseInt(activeId.replace("task-", ""));
      const overTaskId = parseInt(overId.replace("task-", ""));

      setTasks((tasks) => {
        const oldIndex = tasks.findIndex((t) => t.id === activeTaskId);
        const newIndex = tasks.findIndex((t) => t.id === overTaskId);
        return arrayMove(tasks, oldIndex, newIndex);
      });
    }
  }

 const currentProjectTasks = tasks.filter((task) => task.project === activeProjects || !task.project);
 const totalTasks = currentProjectTasks.length;
 const completedTasks = currentProjectTasks.filter((task) => task.columnId === 3).length;
 const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="flex min-h-screen bg-[#0E0F11] text-zinc-100 font-sans">

  
      <div className="flex-1 flex flex-col">
  
        <header className="px-8 py-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0E0F11]/80 backdrop-blur-md sticky top-0 z-10">
  
          <div className="flex flex-col gap-1 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-medium tracking-tight">TaskFlow</h1>
  
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/5">
                {completedTasks} / {totalTasks} Done
              </span>
            </div>
  
            <div className="h-1 w-full md:w-48 bg-white/5 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
  
        </header>
  
        <main
          className="flex-1 overflow-x-auto p-8"
          onClick={() => setSelectedTaskId(null)}
        >
  
          <div className="flex gap-6 items-start w-max">
  
            <DndContext
              collisionDetection={closestCorners}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
  
              <SortableContext
                items={columns.map((col) => `column-${col.id}`)}
                strategy={horizontalListSortingStrategy}
              >
  
                {columns.map((column) => {
                  const columnTasks = tasks
                    .filter((task) => task.columnId === column.id)
                    .filter((task) => task.project === activeProjects || !task.project)
                    .filter((task) => task.title.toLowerCase().includes(searchTasks.toLowerCase()))
                    .filter((task) => (filterPriority === "All" ? true : task.priority === filterPriority))
                    .sort((a, b) => {
                      if (!a.dueDate) return 1;
                      if (!b.dueDate) return -1;
                      return new Date(a.dueDate) - new Date(b.dueDate);
                    });
                  
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