const express = require('express');
const router = express.Router();
const { getProjects, createProject, deleteProject } = require('../controllers/project.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, getProjects);
router.post('/', authMiddleware, createProject);
router.delete('/:id', authMiddleware, deleteProject);

module.exports = router;