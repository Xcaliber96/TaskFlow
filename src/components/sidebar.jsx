function Sidebar({activeProjects, setactiveProjects}) {
    const projects = ["Taskflow", "Portfolio", "Research"];
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
        <p className="text-[]text-[10px] font-semibold tracking-wider text-zinc-500 uppercase mb-2 px-2">Projects</p>
      <div className="flex flex-col gap-0.5">
        {projects.map((project, index) => (
            <button
            key = {project}
            onClick = {() => setactiveProjects(project) }
            className={`text-sm px-2 py-1.5 rounded text-left transition-colors flex items-center gap-2 ${
                activeProjects === project 
                  ? "bg-white/10 text-zinc-100 font-medium" 
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              }`}
            >
                <span className="w-2 h-2 rounded-full border border-current opacity-50"></span>
              {project}
            </button>
        ))}

      </div>
      
      
      </div>
  
        {/* Filters */}
      <div>
        <p className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase mb-2 px-2">Filters</p>

        <div className="flex flex-col gap-0.5">
          {["My Tasks", "Due Today", "High Priority"].map((filter) => (
            <button 
              key={filter}
              className="text-sm text-zinc-400 hover:bg-white/5 hover:text-zinc-200 px-2 py-1.5 rounded text-left transition-colors"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
  
  export default Sidebar;