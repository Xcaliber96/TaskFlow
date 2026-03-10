      import { useState } from "react";
      import TaskCard from "./TaskCard";
      import { useDroppable } from "@dnd-kit/core";
      import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

      function Column({ id, title, tasks, addTask, deleteTask, moveTask, editTask, updatePriority}) {
        const [newTaskTitle, setNewTaskTitle] = useState("");
        const { setNodeRef } = useDroppable({
          id: `column-${id}`,
        });

        return (
          <div
            className="column"
            style={{
              border: "#f4f5f7 ",
              borderRadius: "10px",
              background: "#1a1a1a",
              padding: "16px",  
              width: "260px",
              minHeight: "300px"
            }}
            ref={setNodeRef}
          >
            <h2>{title}({tasks.length})</h2>
            
            <SortableContext
              items={tasks.map(task => `task-${task.id}`)}
              strategy={verticalListSortingStrategy}
            >
            <div className="task-list">
              {tasks.map((task) => (
                <TaskCard key={task.id} id={task.id} title={task.title} priority={task.priority} deleteTask={deleteTask} moveTask={moveTask} editTask={editTask} updatePriority={updatePriority}/>
              ))}
            </div>
            </SortableContext>

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