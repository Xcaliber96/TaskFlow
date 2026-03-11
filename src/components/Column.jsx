      import { useState } from "react";
      import TaskCard from "./TaskCard";
      import { useDroppable } from "@dnd-kit/core";
      import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
    

      function Column({ id, title, tasks, addTask, deleteTask, moveTask, editTask, updatePriority}) {
        const [newTaskTitle, setNewTaskTitle] = useState("");
        const [newDueDate, setNewDueDate] = useState("");
        const { setNodeRef, isOver } = useDroppable({
          id: `column-${id}`,
        });

        return (
          <div
            className="column"
            style={{
              border: isOver ? "2px dashed #4f46e5" : "2px solid transparent",
              borderRadius: "10px",
              background: isOver ?"#22222" : "#1a1a1a",
              padding: "16px",  
              width: "260px",
              minHeight: "300px",
              transition: "all 0.2s ease"
            }}
            ref={setNodeRef}
          >
            <h2 style={{ marginBottom: "10px" }}>
              {title} ({tasks.length})
            </h2>
            
            <SortableContext
              items={tasks.map(task => `task-${task.id}`)}
              strategy={verticalListSortingStrategy}
            >
            <div className="task-list">
              {tasks.length === 0 && <p style={{color: "#888", fontStyle: "italic"}}>No tasks yet</p>}
              {tasks.map((task) => (
                <TaskCard key={task.id} id={task.id} title={task.title} priority={task.priority} deleteTask={deleteTask} moveTask={moveTask} editTask={editTask} updatePriority={updatePriority} dueDate={task.dueDate}/>
              ))}
            </div>
            </SortableContext>

            <input
              type="text"
              placeholder="New task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTask(id, newTaskTitle, newDueDate);
                  setNewTaskTitle("");
                  setNewDueDate("");
                }
              }}
            />
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            ></input>
            <button
              onClick={() => {
                addTask(id, newTaskTitle, newDueDate);
                setNewDueDate("");
                setNewTaskTitle("");
              }}
            >
              Add Task
            </button>
          </div>
        );
      }

      export default Column;