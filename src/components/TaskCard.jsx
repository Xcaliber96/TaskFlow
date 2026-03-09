import { useState } from "react";

function TaskCard({ id, title, deleteTask, moveTask, editTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  return (
    <div
      style={{
        border: "1px solid black",
        padding: "5px",
        marginBottom: "5px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
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