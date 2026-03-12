import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

  
function TaskCard({ id, title, priority, deleteTask, dueDate, editTask, updatePriority, selectedTaskId, setSelectedTaskId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPriorityMenuOpen, setIsPriorityMenuOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(title);


  const isSelected = selectedTaskId === id;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `task-${id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22)",
  };

  const priorityConfig = {
    Low: { class: "bg-white/5 text-zinc-400 border-white/10", icon: "↓" },
    Medium: { class: "bg-orange-500/10 text-orange-400 border-orange-500/20", icon: "—" },
    High: { class: "bg-red-500/10 text-red-400 border-red-500/20", icon: "↑" },
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
      dueConfig = { text: "Today", class: "text-orange-400 bg-orange-500/10 border-orange-500/20" };
    } else {
      const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
      dueConfig = { text: `${daysLeft}d`, class: "text-zinc-400 bg-white/5 border-white/10" };
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
        relative group flex flex-col gap-3 p-3 rounded-lg bg-[#1A1C20] 
        transition-all duration-200 cursor-grab active:cursor-grabbing
        ${isSelected ? "ring-2 ring-indigo-500 border-transparent shadow-md" : "border border-white/[0.04] hover:border-white/10 shadow-sm hover:shadow-md"}
        ${isDragging ? "opacity-60 scale-105 shadow-2xl shadow-black ring-1 ring-indigo-500/50 z-50" : ""}
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
          <div className="flex justify-end gap-2">
            <button 
              onPointerDown={(e) => e.stopPropagation()} 
              onClick={() => setIsEditing(false)} 
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Cancel
            </button>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => {
                editTask(id, newTitle);
                setIsEditing(false);
              }}
              className="bg-white/10 hover:bg-white/20 text-zinc-200 text-xs px-2.5 py-1 rounded transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-zinc-200 leading-snug break-words pr-6">
            {title}
          </p>

          <div className="flex items-center gap-2 mt-auto">
            <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${priorityConfig[priority].class}`}>
              <span className="opacity-70">{priorityConfig[priority].icon}</span>
              {priority}
            </span>

            {dueConfig && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border flex items-center gap-1 ${dueConfig.class}`}>
                <svg className="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {dueConfig.text}
              </span>
            )}
          </div>

          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-[#1A1C20] shadow-sm shadow-black rounded border border-white/5">
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-l transition-colors"
              title="Edit Title"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            
            <div className="relative">
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setIsPriorityMenuOpen(!isPriorityMenuOpen)}
                className="p-1.5 text-zinc-500 hover:text-indigo-400 hover:bg-white/5 transition-colors flex items-center justify-center"
                title="Change Priority"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </button>
              
              {isPriorityMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={(e) => { e.stopPropagation(); setIsPriorityMenuOpen(false); }} 
                  />
                  <div className="absolute right-0 top-full mt-1 w-24 bg-[#141518] border border-white/10 rounded-md shadow-xl z-50 py-1 overflow-hidden animate-in fade-in duration-100">
                    {["Low", "Medium", "High"].map(level => (
                      <button
                        key={level}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          updatePriority(id, level);
                          setIsPriorityMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${priority === level ? "bg-indigo-500/10 text-indigo-400" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => {
                deleteTask(id);
                setSelectedTaskId(null); 
              }}
              className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded-r transition-colors"
              title="Delete Task"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskCard;