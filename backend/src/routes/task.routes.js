const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTaskStatus, deleteTask } = require('../controllers/task.controller');
const authMiddleware = require('../middleware/auth.middleware');
const aiController = require('../controllers/ai.controller');

router.get('/:projectId', authMiddleware, getTasks);
router.post('/', authMiddleware, createTask);
router.put('/:id', authMiddleware, updateTaskStatus);
router.delete('/:id', authMiddleware, deleteTask);
router.post('/ai', authMiddleware, aiController);

module.exports = router;