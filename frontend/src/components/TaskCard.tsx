interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
}

interface Props {
  task: Task;
  onStatusChange: (id: number, status: string) => void;
  onDelete: (id: number) => void;
}

export default function TaskCard({ task, onStatusChange, onDelete }: Props) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 mb-3 hover:bg-white/15 transition group">
      <strong className="text-white font-semibold block mb-1">{task.title}</strong>
      {task.description && (
        <p className="text-white/50 text-sm mb-3">{task.description}</p>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        {task.status !== 'todo' && (
          <button onClick={() => onStatusChange(task.id, 'todo')} className="px-3 py-1 text-xs font-medium bg-slate-500/40 hover:bg-slate-500/60 text-white rounded-lg transition">
            📋 To Do
          </button>
        )}
        {task.status !== 'in_progress' && (
          <button onClick={() => onStatusChange(task.id, 'in_progress')} className="px-3 py-1 text-xs font-medium bg-amber-500/40 hover:bg-amber-500/60 text-white rounded-lg transition">
            ⚡ En progreso
          </button>
        )}
        {task.status !== 'done' && (
          <button onClick={() => onStatusChange(task.id, 'done')} className="px-3 py-1 text-xs font-medium bg-emerald-500/40 hover:bg-emerald-500/60 text-white rounded-lg transition">
            ✅ Hecho
          </button>
        )}
        <button onClick={() => onDelete(task.id)} className="px-3 py-1 text-xs font-medium bg-red-500/40 hover:bg-red-500/60 text-white rounded-lg transition ml-auto">
          🗑 Eliminar
        </button>
      </div>
    </div>
  );
}