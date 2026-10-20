
import { Router } from 'express';
import { getBooks } from '../controllers/booksController.js';
import { availableBooks } from '../controllers/booksController.js';
import { getBookById } from '../controllers/booksController.js';
import { createBook } from '../controllers/booksController.js';
import { updateBook } from '../controllers/booksController.js';
import { deleteBook } from '../controllers/booksController.js';

import validarJWT from '../middlewares/validarJwt.js';
import tieneRol from '../middlewares/validarRoles.js';
import validarCampos from '../middlewares/validarCampos.js';

import {
    bookId,
    createBookValidators,
    updateBookValidators,
    bookQuery
} from '../validators/booksValidators.js';

const router = Router();

// Consultar libros con paginación, filtros, búsqueda y orden
router.get('/', [
    ...bookQuery,
    validarCampos
], getBooks);

// Consultar libros disponibles
router.get('/available', availableBooks);   

// Consultar un libro por ID
router.get('/:id', [
    bookId,
    validarCampos
], getBookById);

// Crear libro: solo ADMIN
router.post('/', [
    validarJWT,
    tieneRol('ADMIN'),
    ...createBookValidators,
    validarCampos
], createBook);

// Actualizar libro: solo ADMIN
router.put('/:id', [
    validarJWT,
    tieneRol('ADMIN'),
    bookId,
    ...updateBookValidators,
    validarCampos
], updateBook);

// Desactivar libro: solo ADMIN
router.delete('/:id', [
    validarJWT,
    tieneRol('ADMIN'),
    bookId,
    validarCampos
], deleteBook);

export default router;
