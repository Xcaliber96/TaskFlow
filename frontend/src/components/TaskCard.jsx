import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const priorityConfig = {
  Low: {
    badge: "text-zinc-500 bg-white/[0.04] border-white/[0.08]",
    dot: "#71717a",
    icon: (
      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    ),
  },
  Medium: {
    badge: "text-amber-400 bg-amber-500/[0.08] border-amber-500/20",
    dot: "#f59e0b",
    icon: (
      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
      </svg>
    ),
  },
  High: {
    badge: "text-red-400 bg-red-500/[0.08] border-red-500/20",
    dot: "#ef4444",
    icon: (
      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    ),
  },
};

function TaskCard({ id, title, priority, deleteTask, dueDate, editTask, updatePriority, selectedTaskId, setSelectedTaskId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPriorityMenuOpen, setIsPriorityMenuOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const safePriority = priority || "Low";
  const pConfig = priorityConfig[safePriority] || priorityConfig["Low"];
  const isSelected = selectedTaskId === id;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `task-${id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22)",
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let dueConfig = null;
  if (dueDate) {
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    if (due < today) {
      dueConfig = { text: "Overdue", class: "text-red-400 bg-red-500/10 border-red-500/20" };
    } else if (due.getTime() === today.getTime()) {
      dueConfig = { text: "Today", class: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    } else {
      const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
      dueConfig = { text: `${daysLeft}d`, class: "text-zinc-500 bg-white/[0.04] border-white/[0.08]" };
    }
  }

  return (
    <div
      ref={setNodeRef}
      {...(isEditing ? {} : listeners)}
      {...attributes}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedTaskId(id);
      }}
      className={`
        relative group flex flex-col gap-2.5 p-3 rounded-lg
        bg-[#17191D] transition-all duration-150 cursor-grab active:cursor-grabbing
        ${isSelected
          ? "ring-1 ring-indigo-500/60 border-transparent shadow-lg shadow-indigo-500/5"
          : "border border-white/[0.05] hover:border-white/[0.1] hover:bg-[#1C1E23]"
        }
        ${isDragging ? "opacity-50 scale-[1.02] shadow-2xl shadow-black/60 ring-1 ring-indigo-500/40 z-50" : ""}
      `}
    >
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={newTitle}
            onPointerDown={(e) => e.stopPropagation()}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-[#0E0F11] border border-white/10 rounded-md p-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 resize-none"
            rows={2}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                editTask(id, newTitle);
                setIsEditing(false);
              }
            }}
          />
          <div className="flex justify-end gap-1.5">
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setIsEditing(false)}
              className="text-xs text-zinc-600 hover:text-zinc-400 px-2 py-1 transition-colors"
            >
              Cancel
            </button>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => {
                editTask(id, newTitle);
                setIsEditing(false);
              }}
              className="bg-white/[0.07] hover:bg-white/[0.12] text-zinc-200 text-xs px-2.5 py-1 rounded transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* High priority accent line */}
          {safePriority === "High" && (
            <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-red-500/50 rounded-full" />
          )}

          <p className="text-sm text-zinc-200 leading-snug break-words pr-5">
            {title}
          </p>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${pConfig.badge}`}>
              {pConfig.icon}
              {safePriority}
            </span>

            {dueConfig && (
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${dueConfig.class}`}>
                <svg className="w-2.5 h-2.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {dueConfig.text}
              </span>
            )}
          </div>

          {/* Hover action toolbar */}
          <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-[#111215] shadow-md rounded-md border border-white/[0.07]">
            {/* Edit */}
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.05] rounded-l-md transition-colors"
              title="Edit"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>

            {/* Priority */}
            <div className="relative">
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setIsPriorityMenuOpen(!isPriorityMenuOpen)}
                className="p-1.5 text-zinc-600 hover:text-indigo-400 hover:bg-white/[0.05] transition-colors"
                title="Priority"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </button>

              {isPriorityMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onPointerDown={(e) => { e.stopPropagation(); setIsPriorityMenuOpen(false); }} />
                  <div className="absolute right-0 top-full mt-1 w-24 bg-[#111215] border border-white/10 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                    {["Low", "Medium", "High"].map((level) => (
                      <button
                        key={level}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          updatePriority(id, level);
                          setIsPriorityMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center gap-2 ${
                          priority === level
                            ? "text-indigo-400 bg-indigo-500/10"
                            : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200"
                        }`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: priorityConfig[level]?.dot }}
                        />
                        {level}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Delete */}
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => {
                deleteTask(id);
                setSelectedTaskId(null);
              }}
              className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-white/[0.05] rounded-r-md transition-colors"
              title="Delete"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskCard;