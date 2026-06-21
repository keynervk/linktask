import TaskCard from './TaskCard';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
}

interface Props {
  tasks: Task[];
  onStatusChange: (id: number, status: string) => void;
  onDelete: (id: number) => void;
}

const columns = [
  { key: 'todo', label: '📋 To Do', color: 'border-slate-400/30 bg-slate-400/10' },
  { key: 'in_progress', label: '⚡ En progreso', color: 'border-amber-400/30 bg-amber-400/10' },
  { key: 'done', label: '✅ Hecho', color: 'border-emerald-400/30 bg-emerald-400/10' },
];

export default function KanbanBoard({ tasks, onStatusChange, onDelete }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map(col => (
        <div key={col.key} className={`border backdrop-blur-md rounded-2xl p-4 ${col.color}`}>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{col.label}</h4>
          {tasks.filter(t => t.status === col.key).map(task => (
            <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} onDelete={onDelete} />
          ))}
          {tasks.filter(t => t.status === col.key).length === 0 && (
            <p className="text-white/30 text-sm text-center py-8">Sin tareas</p>
          )}
        </div>
      ))}
    </div>
  );
}