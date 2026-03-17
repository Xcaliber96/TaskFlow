import { useEffect, useState } from "react";
import Board from "./components/Board"; 
import Sidebar from "./components/sidebar"; 
import Analytics from "./components/Analytics";
import { TaskProvider } from "./context/TaskContext";

function App() {
  const [activeProjects, setactiveProjects] = useState("Taskflow");
  const [currentView, setCurrentView] = useState("board");
  const [currentFilter, setCurrentFilter] = useState("All");

    const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
      return savedTasks
      ? JSON.parse(savedTasks)
      :[
        { id: 1, title: "Learn React", columnId: 1, priority: "Low", dueDate: "", project: "Taskflow" },
        { id: 2, title: "Build Kanban", columnId: 1, priority: "Medium", dueDate: "", project: "Taskflow" },
        { id: 3, title: "Push to GitHub", columnId: 2, priority: "High", dueDate: "", project: "Portfolio" },
      ];
    });

    useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);
  return (
    <TaskProvider>
      
      <div className="flex h-screen w-full bg-[#0E0F11] text-zinc-100 overflow-hidden">
        <Sidebar 
        
        activeProjects={activeProjects}
        setactiveProjects={setactiveProjects}
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter} 
        
        />

        <main className="flex-1 flex flex-col overflow-hidden">
         {currentView === "board" ? (
          <Board 
              activeProjects={activeProjects} 
              tasks={tasks} 
              setTasks={setTasks} 
              currentFilter={currentFilter}
              />
         ): (
          <Analytics activeProjects={activeProjects} tasks={tasks} />
         )}
        </main>

      </div>
    </TaskProvider>
  );
}

export default App;