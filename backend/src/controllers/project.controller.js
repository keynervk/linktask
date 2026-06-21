const pool = require('../config/db');

const getProjects = async (req, res) => {
  try {
    const [projects] = await pool.query('SELECT * FROM projects WHERE owner_id = ?', [req.user.id]);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

const createProject = async (req, res) => {
  const { name, description } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO projects (name, description, owner_id) VALUES (?, ?, ?)',
      [name, description, req.user.id]
    );
    res.status(201).json({ id: result.insertId, name, description });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE project_id = ?', [req.params.id]);
    await pool.query('DELETE FROM projects WHERE id = ? AND owner_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Proyecto eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
  }
};

module.exports = { getProjects, createProject, deleteProject };