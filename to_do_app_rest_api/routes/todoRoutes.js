import express from 'express';
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
} from '../controllers/todoController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All todo routes are protected and require authentication
router.get('/', auth, getTodos);
router.get('/:id', auth, getTodoById);
router.post('/', auth, createTodo);
router.patch('/:id', auth, updateTodo);
router.delete('/:id', auth, deleteTodo);

export default router;
