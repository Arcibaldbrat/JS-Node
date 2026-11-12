import express from 'express';
import { addPost, deletePost } from './controllers/postController.js';

const router = express.Router();

router.post('/add', addPost);
router.post('/delete', deletePost);

export default router;