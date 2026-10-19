import { Router } from 'express';

import { getBooks } from '../controllers/booksController.js';
import { availableBooks } from '../controllers/booksController.js';
import { getBookById } from '../controllers/booksController.js';
import { createBook } from '../controllers/booksController.js';
import { updateBook } from '../controllers/booksController.js';
import { deleteBook } from '../controllers/booksController.js';

import validarJWT from '../middlewares/validarJwt.js';
import tieneRol from '../middlewares/validarRoles.js';

const router = Router();

router.get('/', getBooks);
router.get('/available', availableBooks);
router.get('/:id', getBookById);
router.post('/', [validarJWT, tieneRol('ADMIN')], createBook);
router.put('/:id', [validarJWT, tieneRol('ADMIN')], updateBook);
router.delete('/:id', [validarJWT, tieneRol('ADMIN')], deleteBook);

export default router;
