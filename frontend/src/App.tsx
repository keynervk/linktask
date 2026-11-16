import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';

// Las paginas privadas exigen haber iniciado sesion
function RutaPrivada({ children }: { children: ReactNode }) {
  return localStorage.getItem('token') ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<RutaPrivada><Dashboard /></RutaPrivada>} />
        <Route path="/project/:id" element={<RutaPrivada><ProjectDetail /></RutaPrivada>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
