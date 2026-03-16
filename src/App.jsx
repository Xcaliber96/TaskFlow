import Board from "./components/Board"; 
import Sidebar from "./components/sidebar"; 
import { TaskProvider } from "./context/TaskContext";

function App() {
  return (
    <TaskProvider>
      
      <div className="flex h-screen w-full bg-[#0E0F11] text-zinc-100 overflow-hidden">
        
      
        <Sidebar />

        
        <main className="flex-1 flex flex-col overflow-hidden">
          <Board />
        </main>

      </div>
    </TaskProvider>
  );
}

export default App;