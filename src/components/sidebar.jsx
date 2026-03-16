function Sidebar() {
    return (
        <div className="w-64 min-h-screen bg-[#0E0F11] border-r border-white/5 p-4">
        
        {/* Workspace */}
        <div>
          <p className="text-xs text-zinc-500 uppercase mb-2">Workspace</p>
          <div className="text-sm text-zinc-300 px-2 py-1 rounded hover:bg-white/5 cursor-pointer">
            Personal
          </div>
        </div>
  
        {/* Projects */}
        <div>
          <p className="text-xs text-zinc-500 uppercase mb-2">Projects</p>
  
          <div className="flex flex-col gap-1">
            <button className="text-sm text-zinc-400 hover:bg-white/5 px-2 py-1 rounded text-left">
              TaskFlow
            </button>
  
            <button className="text-sm text-zinc-400 hover:bg-white/5 px-2 py-1 rounded text-left">
              Portfolio
            </button>
  
            <button className="text-sm text-zinc-400 hover:bg-white/5 px-2 py-1 rounded text-left">
              Research
            </button>
          </div>
        </div>
  
        {/* Filters */}
        <div>
          <p className="text-xs text-zinc-500 uppercase mb-2">Filters</p>
  
          <div className="flex flex-col gap-1">
            <button className="text-sm text-zinc-400 hover:bg-white/5 px-2 py-1 rounded text-left">
              My Tasks
            </button>
  
            <button className="text-sm text-zinc-400 hover:bg-white/5 px-2 py-1 rounded text-left">
              Due Today
            </button>
  
            <button className="text-sm text-zinc-400 hover:bg-white/5 px-2 py-1 rounded text-left">
              High Priority
            </button>
          </div>
        </div>
  
      </div>
    );
  }
  
  export default Sidebar;