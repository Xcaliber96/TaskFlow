import { useState } from "react";
import TaskCard from "./TaskCard";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const columnConfig = {
  1: { accent: "#6366f1", label: "todo" },   // indigo — To Do
  2: { accent: "#f59e0b", label: "in-progress" }, // amber — In Progress
  3: { accent: "#22c55e", label: "done" },    // green — Done
};

function Column({ id, title, tasks, addTask, deleteTask, editTask, updatePriority, selectedTaskId, setSelectedTaskId }) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const config = columnConfig[id] || { accent: "#6366f1" };

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `column-${id}`,
    data: { type: "Column" },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        w-[300px] shrink-0 flex flex-col rounded-xl
        bg-[#111215] border border-white/[0.05]
        transition-all duration-200
        ${isDragging ? "opacity-40 ring-2 ring-indigo-500/50" : ""}
      `}
    >
      {/* Column header with left accent bar */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.05] cursor-grab active:cursor-grabbing hover:bg-white/[0.02] rounded-t-xl transition-colors"
      >
        <div className="flex items-center gap-2.5 pointer-events-none">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: config.accent }}
          />
          <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            {title}
          </h2>
          <span
            className="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
            style={{
              backgroundColor: `${config.accent}18`,
              color: config.accent,
            }}
          >
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 p-2 flex flex-col gap-1.5 min-h-[120px]">
        <SortableContext items={tasks.map((task) => `task-${task.id}`)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 && !isAdding && (
            <div className="h-full flex items-center justify-center text-zinc-700 text-xs py-10 border border-dashed border-white/[0.04] rounded-lg">
              Drop tasks here
            </div>
          )}
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              priority={task.priority}
              deleteTask={deleteTask}
              editTask={editTask}
              updatePriority={updatePriority}
              dueDate={task.dueDate}
              selectedTaskId={selectedTaskId}
              setSelectedTaskId={setSelectedTaskId}
            />
          ))}
        </SortableContext>
      </div>

      {/* Add task area */}
      <div className="p-2 pt-0">
        {isAdding ? (
          <div className="flex flex-col gap-2 bg-white/[0.04] p-2.5 rounded-lg border border-white/[0.07]">
            <input
              autoFocus
              type="text"
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="px-2 py-1.5 text-sm bg-transparent text-zinc-200 placeholder-zinc-600 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  addTask(id, newTaskTitle, newDueDate);
                  setNewTaskTitle("");
                  setNewDueDate("");
                  setIsAdding(false);
                }
                if (e.key === "Escape") setIsAdding(false);
              }}
            />
            <div className="flex items-center gap-2 justify-between">
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="px-2 py-1 text-xs bg-[#0E0F11] border border-white/10 rounded text-zinc-500 focus:outline-none [&::-webkit-calendar-picker-indicator]:invert-[0.4]"
              />
              <div className="flex gap-1">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-2 py-1 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addTask(id, newTaskTitle, newDueDate);
                    setNewTaskTitle("");
                    setNewDueDate("");
                    setIsAdding(false);
                  }}
                  className="px-2.5 py-1 text-xs rounded font-medium transition-colors"
                  style={{ backgroundColor: `${config.accent}20`, color: config.accent }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            id={`add-task-btn-${id}`}
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.03] rounded-lg transition-colors group"
          >
            <span className="text-base leading-none group-hover:text-indigo-400 transition-colors">+</span>
            <span>Add task</span>
            {id === 1 && (
              <span className="ml-auto text-[9px] font-mono border border-white/10 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">C</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default Column;