import { Router } from 'express';

import { getBooks } from '../controllers/booksController.js';
import { availableBooks } from '../controllers/booksController.js';
import { getBookById } from '../controllers/booksController.js';
import { createBook } from '../controllers/booksController.js';

import { updateBook } from '../controllers/booksController.js';

const router = Router();

router.get('/', getBooks);
router.get('/available', availableBooks);
router.get('/:id', getBookById);
router.post('/', createBook);
router.put('/:id', updateBook);

export default router;
