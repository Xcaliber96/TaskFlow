
import { useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Board from "./components/Board"; 
import Sidebar from "./components/sidebar"; 
import Analytics from "./components/Analytics";
import { TaskProvider } from "./context/TaskContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
      staleTime: 1000 * 60 * 5,    
      retry: 1,                    
    },
  },
});

function App() {
  const [activeProjects, setactiveProjects] = useState("Taskflow");
  const [currentView, setCurrentView] = useState("board");
  const [currentFilter, setCurrentFilter] = useState("All");

  return (
   
    <QueryClientProvider client={queryClient}>
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
                currentFilter={currentFilter}
                />
           ): (
            <Analytics activeProjects={activeProjects} />
           )}
          </main>
        </div>
      </TaskProvider>
    </QueryClientProvider>
  );
}

export default App;