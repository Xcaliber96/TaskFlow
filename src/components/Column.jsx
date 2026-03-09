    import { useState } from "react";
    import TaskCard from "./TaskCard";

    function Column({ id, title, tasks, addTask, deleteTask, moveTask, editTask}) {
      const [newTaskTitle, setNewTaskTitle] = useState("");

      return (
        <div
          className="column"
          style={{
            border: "1px solid gray",
            padding: "10px",
            width: "200px",
            minHeight: "200px"
          }}
        >
          <h2>{title}</h2>

          <div className="task-list">
            {tasks.map((task) => (
              <TaskCard key={task.id} id={task.id} title={task.title} deleteTask={deleteTask} moveTask={moveTask} editTask={editTask}/>
            ))}
          </div>

          <input
            type="text"
            placeholder="New task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />

          <button
            onClick={() => {
              addTask(id, newTaskTitle);
              setNewTaskTitle("");
            }}
          >
            Add Task
          </button>
        </div>
      );
    }

    export default Column;