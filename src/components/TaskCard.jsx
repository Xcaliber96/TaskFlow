import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


function TaskCard({ id, title, priority, deleteTask, moveTask, editTask, updatePriority}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const { attributes, listeners, setNodeRef, transform, transition } =
  useSortable({
    id: `task-${id}`,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
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
        border: "1px solid black",
        padding: "8px",
        marginBottom: "5px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "grab",
        transition: "transform 0.2s ease"
      
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
            style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
            <span>{title}</span>
            </div>

          <div>
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

            <button onClick={() => moveTask(id)}>
              Move
            </button>

            <button
              onClick={() => deleteTask(id)}
              style={{ marginLeft: "5px" }}
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