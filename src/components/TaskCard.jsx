function TaskCard({ id, title, deleteTask, moveTask }) {
    return (
      <div
        style={{
          border: "1px solid black",
          padding: "5px",
          marginBottom: "5px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}  
      >
        <span>{title}</span>
  
        <div>
          <button onClick={() => moveTask(id)}>→</button>
  
          <button
            onClick={() => deleteTask(id)}
            style={{ marginLeft: "5px" }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
  
  export default TaskCard;