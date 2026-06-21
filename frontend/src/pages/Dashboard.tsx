import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: number;
  name: string;
  description: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchProjects = async () => {
    const res = await api.get('/projects');
    setProjects(res.data);
  };

  useEffect(() => { fetchProjects(); }, []);

  const createProject = async () => {
    if (!name) return;
    await api.post('/projects', { name, description });
    setName('');
    setDescription('');
    setShowForm(false);
    fetchProjects();
  };

  const deleteProject = async (id: number) => {
    await api.delete(`/projects/${id}`);
    fetchProjects();
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">LinkTask</h1>
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-sm">Hola, <span className="text-white font-medium">{user.name}</span> 👋</span>
          <button onClick={logout} className="bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 px-4 py-2 rounded-lg text-sm transition">
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Mis proyectos</h2>
            <p className="text-white/50 mt-1">{projects.length} proyecto{projects.length !== 1 ? 's' : ''} activo{projects.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-lg"
          >
            + Nuevo proyecto
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
            <h3 className="text-white font-semibold text-lg mb-4">Nuevo proyecto</h3>
            <div className="space-y-3">
              <input
                placeholder="Nombre del proyecto"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 transition"
              />
              <input
                placeholder="Descripción (opcional)"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 transition"
              />
              <div className="flex gap-3">
                <button onClick={createProject} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl transition">
                  Crear
                </button>
                <button onClick={() => setShowForm(false)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl transition">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de proyectos */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📋</p>
            <p className="text-white/50 text-lg">No tienes proyectos aún.</p>
            <p className="text-white/30 text-sm mt-1">Crea tu primer proyecto para empezar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(p => (
              <div key={p.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition group">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 bg-indigo-500/30 rounded-xl flex items-center justify-center text-xl">📁</div>
                  <button onClick={() => deleteProject(p.id)} className="opacity-0 group-hover:opacity-100 bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 px-2 py-1 rounded-lg text-xs transition">
                    Eliminar
                  </button>
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">{p.name}</h3>
                <p className="text-white/50 text-sm mb-4">{p.description || 'Sin descripción'}</p>
                <button
                  onClick={() => navigate(`/project/${p.id}`)}
                  className="w-full bg-indigo-600/50 hover:bg-indigo-600 text-white text-sm font-medium py-2 rounded-xl transition"
                >
                  Abrir proyecto →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}