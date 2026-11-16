const pool = require('../config/db');

const getProjects = async (req, res) => {
  try {
    const [projects] = await pool.query('SELECT * FROM projects WHERE owner_id = ?', [req.user.id]);
    res.json(projects);
  } catch (err) {
    console.error('Error al listar proyectos:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const createProject = async (req, res) => {
  const { name, description } = req.body;
  if (!name?.trim()) return res.status(400).json({ message: 'El nombre es obligatorio' });
  try {
    const [result] = await pool.query(
      'INSERT INTO projects (name, description, owner_id) VALUES (?, ?, ?)',
      [name.trim(), description, req.user.id]
    );
    res.status(201).json({ id: result.insertId, name: name.trim(), description });
  } catch (err) {
    console.error('Error al crear proyecto:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const deleteProject = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    // Se verifica el dueño ANTES de borrar nada
    const [rows] = await connection.query(
      'SELECT id FROM projects WHERE id = ? AND owner_id = ?',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Proyecto no encontrado' });

    await connection.beginTransaction();
    await connection.query('DELETE FROM tasks WHERE project_id = ?', [req.params.id]);
    await connection.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    await connection.commit();
    res.json({ message: 'Proyecto eliminado' });
  } catch (err) {
    await connection.rollback();
    console.error('Error al eliminar proyecto:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  } finally {
    connection.release();
  }
};

module.exports = { getProjects, createProject, deleteProject };
