      import Column from "./Column";
      import { useState, useEffect, useRef } from "react";
      import { DndContext, closestCorners } from "@dnd-kit/core";
      import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";

      function Board({ activeProjects, tasks, setTasks, currentFilter }) {
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

        async function updateTaskStatus(taskId, columnId) {
          const res = await fetch(`http://localhost:8000/tasks/${taskId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: columnToStatus(columnId),
            }),
          });

          const updated = await res.json();
          setTasks((prev) =>
            prev.map((task) =>
              task.id === taskId ? { ...task, columnId } : task
            )
          );
        }

        async function updateTaskTitle(taskId, newTitle) {
          await fetch(`http://localhost:8000/tasks/${taskId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: newTitle,
            }),
          });
        }


        async function addTask(columnId, title, dueDate) {
          if (!title.trim()) return;

          const res = await fetch("http://localhost:8000/tasks/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              status: columnToStatus(columnId),
              project: activeProjects
            }),
          });

          const data = await res.json();

          const newTask = {
            id: data.id,
            title,
            columnId,
            priority: "Low",
            dueDate,
            project: activeProjects,
          };

          setTasks((prev) => [...prev, newTask]);
          console.log("PROJECT SENT:", activeProjects);
        }

        async function deleteTask(taskId) {
          await fetch(`http://localhost:8000/tasks/${taskId}`, {
            method: "DELETE",
          });

          setTasks((prev) => prev.filter((task) => task.id !== taskId));

          if (selectedTaskId === taskId) setSelectedTaskId(null);
        }

        async function editTask(taskId, newTitle) {
          await updateTaskTitle(taskId, newTitle);
          setTimeout(() => {
            window.dispatchEvent(new Event("tasksUpdated"));
          }, 200);

          setTasks((prev) =>
            prev.map((task) =>
              task.id === taskId ? { ...task, title: newTitle } : task
            )
          );
        }

        function updatePriority(taskId, newPriority) {
          setTasks((prev) =>
            prev.map((task) =>
              task.id === taskId ? { ...task, priority: newPriority } : task
            )
          );
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
                newTasks[activeIndex] = {
                  ...activeTask,
                  columnId: overTask.columnId,
                };
                return arrayMove(newTasks, activeIndex, overIndex);
              }
            }

            if (isOverColumn) {
              const overColumnId = parseInt(overId.replace("column-", ""));
              if (activeTask.columnId !== overColumnId) {
                const newTasks = [...prevTasks];
                newTasks[activeIndex] = {
                  ...activeTask,
                  columnId: overColumnId,
                };
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
                const oldIndex = prevColumns.findIndex(
                  (col) => `column-${col.id}` === activeId
                );
                const newIndex = prevColumns.findIndex(
                  (col) => `column-${col.id}` === overId
                );
                return arrayMove(prevColumns, oldIndex, newIndex);
              });
            }
            return;
          }

          if (activeId.startsWith("task-")) {
            const activeTaskId = parseInt(activeId.replace("task-", ""));

            if (overId.startsWith("task-")) {
              const overTaskId = parseInt(overId.replace("task-", ""));

              const activeTask = tasks.find((t) => t.id === activeTaskId);
              const overTask = tasks.find((t) => t.id === overTaskId);

              if (
                activeTask &&
                overTask &&
                activeTask.columnId !== overTask.columnId
              ) {
                updateTaskStatus(activeTaskId, overTask.columnId);
              }
            }

            if (overId.startsWith("column-")) {
              const overColumnId = parseInt(overId.replace("column-", ""));
              const activeTask = tasks.find((t) => t.id === activeTaskId);

              if (activeTask && activeTask.columnId !== overColumnId) {
                updateTaskStatus(activeTaskId, overColumnId);

                setTasks((prev) =>
                prev.map((task) =>
                  t.id === activeTaskId ? { ...task, columnId: overColumnId } : t
                ));
              }
            }
          }
        }


        const currentProjectTasks = tasks.filter(
          (task) => task.project === activeProjects || !task.project
        );

        const totalTasks = currentProjectTasks.length;
        const completedTasks = currentProjectTasks.filter(
          (task) => task.columnId === 3
        ).length;

        const progressPercentage =
          totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

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
                    <SortableContext
                      items={columns.map((col) => `column-${col.id}`)}
                      strategy={horizontalListSortingStrategy}
                    >
                      {columns.map((column) => {
                        const columnTasks = tasks
                          .filter((task) => task.columnId === column.id)
                          .filter((task) => task.project === activeProjects);

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