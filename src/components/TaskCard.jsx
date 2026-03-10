import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useContext } from "react";
import { TaskContext } from "../context/TaskContext";



function TaskCard({ id, title, priority, moveTask, editTask, updatePriority }) {

  const { deleteTask } = useContext(TaskContext);

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
  useSortable({
    id: `task-${id}`,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
  };  
  const priorityColors = {
    Low: "green",
    Medium: "orange",
    High: "red",
  };

  return (
    <div
      ref={setNodeRef}
      {...(isEditing ? {} : listeners)}
      {...attributes}
      style={{
        ...style,
        border: "1px solid #333",
        borderRadius: "6px",
        padding: "12px",
        marginBottom: "8px",
        backgroundColor: "#1e1e1e",
        boxShadow: isDragging
        ? "0 10px 25px rgba(0,0,0,0.6)"
        : "0 2px 5px rgba(0,0,0,0.2)",
        opacity: isDragging ? 0.8 : 1,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        cursor: "grab",
        transition: "all 0.15s ease"
      
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
      }}
    >
      {isEditing ? (
        
        <>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          <button
            onClick={() => {
              editTask(id, newTitle);
              setIsEditing(false);
            }}
          >
            Save
          </button>
        </>
      ) : (
        <>
          <div
            style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
                            style ={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              backgroundColor: priorityColors[priority],
                              display: "inline-block",
                            }}
            >

            </span>
            <span style={{ wordBreak: "break-word"}}
            >{title}</span>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
            <select
              value={priority}
              onChange={(e) => updatePriority(id, e.target.value)}
              style={{ marginRight: "10px" }}
            >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>

            </select>

            <button onClick={() => setIsEditing(true)}>
              Edit
            </button>

            <button
              onClick={() => deleteTask(id)}
              style={{ marginLeft: "3px" }}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskCard;