function Sidebar({ activeProjects, setactiveProjects, currentView, setCurrentView, currentFilter, setCurrentFilter }) {
  const projects = [
    { name: "Taskflow", color: "#6366f1" },
    { name: "Portfolio", color: "#22d3ee" },
    { name: "Research", color: "#f59e0b" },
  ];

  const views = [
    {
      id: "board", label: "Kanban Board", icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10m0-10a2 2 0 012 2h2a2 2 0 012-2V7" />
        </svg>
      )
    },
    {
      id: "analytics", label: "Analytics", icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  ];

  const filters = [
    {
      id: "My Tasks", icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: "Due Today", icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: "High Priority", icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
        </svg>
      )
    },
  ];

  return (
    <div className="w-60 min-h-screen bg-[#0A0B0D] border-r border-white/[0.05] flex flex-col">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-indigo-500 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-zinc-100 tracking-tight">TaskFlow</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Workspace */}
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-zinc-600 uppercase mb-1.5 px-2">Workspace</p>
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/[0.04] cursor-pointer group">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">P</div>
            <span className="text-sm text-zinc-300">Personal</span>
          </div>
        </div>

        {/* Views */}
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-zinc-600 uppercase mb-1.5 px-2">Views</p>
          <div className="flex flex-col gap-0.5">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setCurrentView(view.id)}
                className={`text-sm px-2 py-1.5 rounded-md text-left transition-all flex items-center gap-2.5 ${
                  currentView === view.id
                    ? "bg-indigo-500/15 text-indigo-300 font-medium"
                    : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
                }`}
              >
                <span className={currentView === view.id ? "text-indigo-400" : ""}>{view.icon}</span>
                {view.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-zinc-600 uppercase mb-1.5 px-2">Projects</p>
          <div className="flex flex-col gap-0.5">
            {projects.map((project) => (
              <button
                key={project.name}
                onClick={() => {
                  setactiveProjects(project.name);
                  setCurrentFilter("All");
                }}
                className={`text-sm px-2 py-1.5 rounded-md text-left transition-all flex items-center gap-2.5 ${
                  activeProjects === project.name
                    ? "bg-white/[0.07] text-zinc-100 font-medium"
                    : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: activeProjects === project.name ? project.color : "rgba(255,255,255,0.15)" }}
                />
                {project.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-zinc-600 uppercase mb-1.5 px-2">Filters</p>
          <div className="flex flex-col gap-0.5">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setCurrentFilter(filter.id);
                  setCurrentView("board");
                }}
                className={`text-sm px-2 py-1.5 rounded-md text-left transition-all flex items-center gap-2.5 ${
                  currentFilter === filter.id
                    ? "bg-white/[0.07] text-zinc-200 font-medium"
                    : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
                }`}
              >
                <span className={currentFilter === filter.id ? "text-zinc-300" : "text-zinc-600"}>{filter.icon}</span>
                {filter.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom user strip */}
      <div className="px-3 py-3 border-t border-white/[0.05]">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-white/[0.04] cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0">U</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-300 font-medium truncate">My Workspace</p>
            <p className="text-[10px] text-zinc-600 truncate">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;