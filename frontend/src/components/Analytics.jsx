import { useQuery } from "@tanstack/react-query";

function Analytics({ activeProjects }) {
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", activeProjects],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/tasks/?project=${activeProjects}`);
      const data = await res.json();
      return data.map((task) => ({
        id: task.id,
        title: task.title,
        columnId: task.status === "todo" ? 1 : task.status === "in-progress" ? 2 : 3,
        priority: task.priority || "Low",
        dueDate: "",
        project: task.project,
      }));
    },
  });

  const projectTasks = tasks.filter((t) => t.project === activeProjects || !t.project);
  const totalTasks = projectTasks.length;
  const todoTasks = projectTasks.filter((t) => t.columnId === 1).length;
  const inProgressTasks = projectTasks.filter((t) => t.columnId === 2).length;
  const completedTasks = projectTasks.filter((t) => t.columnId === 3).length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const highPriority = projectTasks.filter((t) => t.priority === "High" && t.columnId !== 3).length;
  const mediumPriority = projectTasks.filter((t) => t.priority === "Medium").length;
  const lowPriority = projectTasks.filter((t) => t.priority === "Low").length;

  const statusBars = [
    { label: "To Do", count: todoTasks, color: "#6366f1", bg: "bg-indigo-500" },
    { label: "In Progress", count: inProgressTasks, color: "#f59e0b", bg: "bg-amber-500" },
    { label: "Done", count: completedTasks, color: "#22c55e", bg: "bg-green-500" },
  ];

  const priorityBars = [
    { label: "High", count: highPriority, color: "#ef4444", textClass: "text-red-400" },
    { label: "Medium", count: mediumPriority, color: "#f59e0b", textClass: "text-amber-400" },
    { label: "Low", count: lowPriority, color: "#71717a", textClass: "text-zinc-500" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#0E0F11] text-zinc-100">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">{activeProjects}</h1>
        <p className="text-sm text-zinc-600 mt-1">Project health overview</p>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Completion */}
        <div className="bg-[#111215] border border-white/[0.05] rounded-xl p-5">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">Completion</p>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-4xl font-semibold text-zinc-100 tabular-nums">{progress}%</span>
            <span className="text-xs text-zinc-600 pb-1">{completedTasks}/{totalTasks} tasks</span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-700 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Total Tasks */}
        <div className="bg-[#111215] border border-white/[0.05] rounded-xl p-5">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">Total Tasks</p>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl font-semibold text-zinc-100 tabular-nums">{totalTasks}</span>
          </div>
          <div className="flex gap-3 mt-auto">
            {statusBars.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-xs text-zinc-600">{s.count} {s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* High Priority */}
        <div className="bg-[#111215] border border-red-500/[0.08] rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/[0.04] rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
          <p className="text-xs font-medium text-red-400/70 uppercase tracking-wider mb-4">High Priority Pending</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-semibold text-red-400 tabular-nums">{highPriority}</span>
          </div>
          <p className="text-xs text-zinc-600">
            {highPriority === 0 ? "All clear" : "Requires immediate attention"}
          </p>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Task distribution by status */}
        <div className="bg-[#111215] border border-white/[0.05] rounded-xl p-5">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-5">Status Distribution</p>
          {totalTasks === 0 ? (
            <p className="text-sm text-zinc-700 py-4">No tasks yet</p>
          ) : (
            <div className="space-y-3">
              {statusBars.map((s) => {
                const pct = totalTasks === 0 ? 0 : Math.round((s.count / totalTasks) * 100);
                return (
                  <div key={s.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-zinc-400">{s.label}</span>
                      <span className="text-xs text-zinc-600 tabular-nums">{s.count} · {pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${s.bg} rounded-full transition-all duration-700 ease-out`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Priority breakdown */}
        <div className="bg-[#111215] border border-white/[0.05] rounded-xl p-5">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-5">Priority Breakdown</p>
          {totalTasks === 0 ? (
            <p className="text-sm text-zinc-700 py-4">No tasks yet</p>
          ) : (
            <div className="space-y-3">
              {priorityBars.map((p) => {
                const pct = totalTasks === 0 ? 0 : Math.round((p.count / totalTasks) * 100);
                return (
                  <div key={p.label} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-16 flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-xs text-zinc-400">{p.label}</span>
                    </div>
                    <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${pct}%`, backgroundColor: p.color }}
                      />
                    </div>
                    <span className={`text-xs tabular-nums w-6 text-right ${p.textClass}`}>{p.count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;