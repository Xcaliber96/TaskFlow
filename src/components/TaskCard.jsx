import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


function TaskCard({ id, title, deleteTask, moveTask, editTask }) {
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

  return (
    <div
      ref={setNodeRef}
      {...(isEditing ? {} : listeners)}
      {...attributes}
      style={{
        ...style,
        border: "1px solid black",
        padding: "5px",
        marginBottom: "5px",
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
          <span>{title}</span>

          <div>
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