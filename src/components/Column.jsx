import { useState } from "react";
import TaskCard from "./TaskCard";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


function Column({ id, title, tasks, addTask, deleteTask, editTask, updatePriority, selectedTaskId, setSelectedTaskId }) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `column-${id}`,
    data: {
      type: "Column",
    }
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
        w-[320px] shrink-0 flex flex-col rounded-xl
        bg-[#141518] border border-white/[0.04]
        transition-colors duration-200
        ${isDragging ? "opacity-40 ring-2 ring-indigo-500/50" : ""}
      `}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="flex items-center justify-between p-3 border-b border-white/[0.04] mb-2 cursor-grab active:cursor-grabbing hover:bg-white/[0.02] rounded-t-xl transition-colors"
      >
        <h2 className="text-sm font-medium text-zinc-200 flex items-center gap-2 pointer-events-none">
          {title}
          <span className="text-[11px] font-mono text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">
            {tasks.length}
          </span>
        </h2>
      </div>

      <div className="flex-1 p-2 flex flex-col gap-2 min-h-[150px]">
        <SortableContext items={tasks.map((task) => `task-${task.id}`)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 && !isAdding && (
            <div className="h-full flex items-center justify-center text-zinc-600 text-sm py-8 border border-dashed border-white/5 rounded-lg">
              No tasks
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

      <div className="p-2 pt-0 mt-2">
        {isAdding ? (
          <div className="flex flex-col gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
            <input
              autoFocus
              type="text"
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="px-2 py-1.5 text-sm bg-transparent text-zinc-200 placeholder-zinc-500 focus:outline-none"
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
                className="px-2 py-1 text-xs bg-[#0E0F11] border border-white/10 rounded text-zinc-400 focus:outline-none [&::-webkit-calendar-picker-indicator]:invert-[0.6]"
              />
              <div className="flex gap-1">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200"
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
                  className="px-2 py-1 text-xs bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded font-medium transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            id={`add-task-btn-${id}`} 
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg leading-none group-hover:text-indigo-400 transition-colors">+</span> Add task
            </div>
            
            {id === 1 && (
              <span className="text-[10px] font-mono border border-white/10 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">C</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default Column;