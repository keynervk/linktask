import { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', { name, email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">LinkTask</h1>
          <p className="text-indigo-300">Crea tu cuenta y empieza a organizarte</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 focus:bg-white/20 transition"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 focus:bg-white/20 transition"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 focus:bg-white/20 transition"
          />
          <button
            onClick={handleRegister}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl py-3 transition duration-200 shadow-lg hover:shadow-indigo-500/30"
          >
            Crear cuenta
          </button>
        </div>

        <p className="text-center text-white/50 mt-6 text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link to="/" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}