const pool = require('../config/db');

const ESTADOS_VALIDOS = ['todo', 'in_progress', 'done'];

// true si el proyecto existe y pertenece al usuario autenticado
const esProyectoDelUsuario = async (projectId, userId) => {
  const [rows] = await pool.query('SELECT id FROM projects WHERE id = ? AND owner_id = ?', [projectId, userId]);
  return rows.length > 0;
};

const getTasks = async (req, res) => {
  try {
    if (!(await esProyectoDelUsuario(req.params.projectId, req.user.id))) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    const [tasks] = await pool.query('SELECT * FROM tasks WHERE project_id = ?', [req.params.projectId]);
    res.json(tasks);
  } catch (err) {
    console.error('Error al listar tareas:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const createTask = async (req, res) => {
  const { title, description, project_id } = req.body;
  if (!title?.trim()) return res.status(400).json({ message: 'El título es obligatorio' });
  try {
    if (!(await esProyectoDelUsuario(project_id, req.user.id))) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    const [result] = await pool.query(
      'INSERT INTO tasks (title, description, project_id) VALUES (?, ?, ?)',
      [title.trim(), description, project_id]
    );
    res.status(201).json({ id: result.insertId, title: title.trim(), description, status: 'todo' });
  } catch (err) {
    console.error('Error al crear tarea:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  if (!ESTADOS_VALIDOS.includes(status)) {
    return res.status(400).json({ message: `Estado inválido. Usa: ${ESTADOS_VALIDOS.join(', ')}` });
  }
  try {
    // Solo cambia la tarea si su proyecto es del usuario
    const [result] = await pool.query(
      `UPDATE tasks t JOIN projects p ON p.id = t.project_id
       SET t.status = ? WHERE t.id = ? AND p.owner_id = ?`,
      [status, req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.json({ message: 'Estado actualizado' });
  } catch (err) {
    console.error('Error al actualizar tarea:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const [result] = await pool.query(
      `DELETE t FROM tasks t JOIN projects p ON p.id = t.project_id
       WHERE t.id = ? AND p.owner_id = ?`,
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.json({ message: 'Tarea eliminada' });
  } catch (err) {
    console.error('Error al eliminar tarea:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { getTasks, createTask, updateTaskStatus, deleteTask, esProyectoDelUsuario };
