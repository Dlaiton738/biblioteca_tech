import { Router } from 'express';
import { getLoans } from '../controllers/loansController.js';
import { getLoanById } from '../controllers/loansController.js';
import { createLoan } from '../controllers/loansController.js';

import { returnLoan } from '../controllers/loansController.js';

import validarJWT from '../middlewares/validarJwt.js';
import tieneRol from '../middlewares/validarRoles.js';

const router = Router();

// Consultar todos los préstamos: solo ADMIN
router.get('/', [
    validarJWT,
    tieneRol('ADMIN')
], getLoans);

// Crear préstamo: usuario autenticado
router.post('/', [
    validarJWT
], createLoan);

// Consultar un préstamo: usuario autenticado
router.get('/:_id', [
    validarJWT
], getLoanById);

// Devolver un libro: usuario autenticado
router.patch('/:_id/return', [
    validarJWT
], returnLoan);

export default router;
