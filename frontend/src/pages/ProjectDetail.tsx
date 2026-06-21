import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import KanbanBoard from '../components/KanbanBoard';
import AIChat from '../components/AIChat';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchTasks = async () => {
    const res = await api.get(`/tasks/${id}`);
    setTasks(res.data);
  };

  useEffect(() => { fetchTasks(); }, [id]);

  const createTask = async () => {
    if (!title) return;
    await api.post('/tasks', { title, description, project_id: id });
    setTitle('');
    setDescription('');
    setShowForm(false);
    fetchTasks();
  };

  const updateStatus = async (taskId: number, status: string) => {
    await api.put(`/tasks/${taskId}`, { status });
    fetchTasks();
  };

  const deleteTask = async (taskId: number) => {
    await api.delete(`/tasks/${taskId}`);
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">LinkTask</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          ← Volver
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Tablero de tareas</h2>
            <p className="text-white/50 mt-1">{tasks.length} tarea{tasks.length !== 1 ? 's' : ''} en total</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-lg"
          >
            + Nueva tarea
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
            <h3 className="text-white font-semibold text-lg mb-4">Nueva tarea</h3>
            <div className="space-y-3">
              <input
                placeholder="Título de la tarea"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 transition"
              />
              <input
                placeholder="Descripción (opcional)"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 transition"
              />
              <div className="flex gap-3">
                <button onClick={createTask} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl transition">
                  Agregar
                </button>
                <button onClick={() => setShowForm(false)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl transition">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Kanban */}
        <KanbanBoard tasks={tasks} onStatusChange={updateStatus} onDelete={deleteTask} />

        {/* IA */}
        <AIChat projectName={id || ''} tasks={tasks} />
      </div>
    </div>
  );
}