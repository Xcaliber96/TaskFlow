import { useEffect, useState } from "react";
import Board from "./components/Board"; 
import Sidebar from "./components/sidebar"; 
import Analytics from "./components/Analytics";
import { TaskProvider } from "./context/TaskContext";

function App() {
  const [activeProjects, setactiveProjects] = useState("Taskflow");
  const [currentView, setCurrentView] = useState("board");
  const [currentFilter, setCurrentFilter] = useState("All");

  const [tasks, setTasks] = useState([]);

  function statusToColumn(status) {
    if (status === "todo") return 1;
    if (status === "in-progress") return 2;
    return 3;
  }
  
  useEffect(() => {
    fetch(`http://localhost:8000/tasks/?project=${activeProjects}`)
      .then(res => res.json())
      .then(data => {
        const mappedTasks = data.map(task => ({
          id: task.id,
          title: task.title,
          columnId:
            task.status === "todo"
              ? 1
              : task.status === "in-progress"
              ? 2
              : 3,
          project: task.project
        }));
  
        setTasks(mappedTasks);
      });
  }, [activeProjects]);
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
console.log("FETCH CALLED");
export default App;