const pool = require('../config/db');

const getTasks = async (req, res) => {
  try {
    const [tasks] = await pool.query('SELECT * FROM tasks WHERE project_id = ?', [req.params.projectId]);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

const createTask = async (req, res) => {
  const { title, description, project_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO tasks (title, description, project_id) VALUES (?, ?, ?)',
      [title, description, project_id]
    );
    res.status(201).json({ id: result.insertId, title, description, status: 'todo' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query('UPDATE tasks SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Estado actualizado' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ message: 'Tarea eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

module.exports = { getTasks, createTask, updateTaskStatus, deleteTask };