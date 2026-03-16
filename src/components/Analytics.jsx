function Analytics({ activeProjects, tasks }) {
  
    const projectTasks = tasks.filter(t => t.project === activeProjects || !t.project);
 
    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(t => t.columnId === 3).length;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    
    const highPriority = projectTasks.filter(t => t.priority === "High" && t.columnId !== 3).length;
    const inProgress = projectTasks.filter(t => t.columnId === 2).length;
  
    return (
      <div className="flex-1 overflow-y-auto p-10 bg-[#0E0F11] text-zinc-100 h-full">
        <header className="mb-10">
          <h1 className="text-3xl font-medium tracking-tight mb-2">{activeProjects} Analytics</h1>
          <p className="text-zinc-500 text-sm">Overview of your current project health and task distribution.</p>
        </header>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          
          <div className="bg-[#141518] border border-white/5 rounded-xl p-6 flex flex-col justify-between">
            <p className="text-sm font-medium text-zinc-400 mb-4">Project Completion</p>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-5xl font-semibold text-zinc-100">{progress}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-1000 ease-out" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
  
         
          <div className="bg-[#141518] border border-white/5 rounded-xl p-6 flex flex-col justify-between">
            <p className="text-sm font-medium text-zinc-400 mb-4">Total Tasks</p>
            <div className="flex flex-col gap-1">
              <span className="text-5xl font-semibold text-zinc-100">{totalTasks}</span>
              <span className="text-sm text-zinc-500">{completedTasks} completed</span>
            </div>
          </div>
  
          
          <div className="bg-[#141518] border border-red-500/10 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <p className="text-sm font-medium text-red-400/80 mb-4">Pending High Priority</p>
            <div className="flex flex-col gap-1">
              <span className="text-5xl font-semibold text-red-400">{highPriority}</span>
              <span className="text-sm text-zinc-500">Requires immediate attention</span>
            </div>
          </div>
  
        </div>
      </div>
    );
  }
  
  export default Analytics;