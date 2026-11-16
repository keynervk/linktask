const Groq = require('groq-sdk');
const pool = require('../config/db');

const MAX_MENSAJES = 20;
const MAX_CARACTERES = 2000;
const MAX_PETICIONES_POR_MINUTO = 10;

let groq;
const clienteGroq = () => {
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groq;
};

// Limite simple en memoria: evita que un usuario agote la cuota de Groq
const peticionesPorUsuario = new Map();
const superaLimite = (userId) => {
  const ahora = Date.now();
  const recientes = (peticionesPorUsuario.get(userId) || []).filter((t) => ahora - t < 60_000);
  recientes.push(ahora);
  peticionesPorUsuario.set(userId, recientes);
  return recientes.length > MAX_PETICIONES_POR_MINUTO;
};

module.exports = async (req, res) => {
  const { projectId, messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MENSAJES) {
    return res.status(400).json({ message: `Envía entre 1 y ${MAX_MENSAJES} mensajes` });
  }
  // Solo se aceptan mensajes de usuario y asistente: el prompt de sistema lo arma el servidor
  const historial = messages.map((m) => ({ role: m?.role, content: m?.content }));
  const valido = historial.every(
    (m) => ['user', 'assistant'].includes(m.role)
      && typeof m.content === 'string'
      && m.content.length > 0
      && m.content.length <= MAX_CARACTERES
  );
  if (!valido) {
    return res.status(400).json({ message: `Mensajes inválidos (máximo ${MAX_CARACTERES} caracteres cada uno)` });
  }

  if (superaLimite(req.user.id)) {
    return res.status(429).json({ message: 'Demasiadas preguntas seguidas. Espera un minuto.' });
  }

  try {
    const [proyectos] = await pool.query(
      'SELECT name, description FROM projects WHERE id = ? AND owner_id = ?',
      [projectId, req.user.id]
    );
    if (proyectos.length === 0) return res.status(404).json({ message: 'Proyecto no encontrado' });

    const [tareas] = await pool.query('SELECT title, status FROM tasks WHERE project_id = ?', [projectId]);
    const resumenTareas = tareas.map((t) => `- ${t.title} (${t.status})`).join('\n');

    const systemPrompt = `Eres un asistente de gestión de proyectos integrado en LinkTask.
Estás ayudando con el proyecto "${proyectos[0].name}"${proyectos[0].description ? `: ${proyectos[0].description}` : ''}.
Las tareas actuales son:
${resumenTareas || 'No hay tareas aún.'}
Responde siempre en español, de forma concisa y útil, y solo sobre la gestión de este proyecto.`;

    const completion = await clienteGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: systemPrompt }, ...historial],
      max_tokens: 1000,
    });

    res.json({ content: [{ text: completion.choices[0].message.content }] });
  } catch (err) {
    console.error('❌ Error en IA:', err);
    res.status(500).json({ message: 'Error al consultar la IA' });
  }
};
