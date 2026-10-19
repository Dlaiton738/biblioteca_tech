import { Router } from 'express';
import { getLoans } from '../controllers/loansController.js';
import { getLoanById } from '../controllers/loansController.js';
import { createLoan } from '../controllers/loansController.js';
import { returnLoan } from '../controllers/loansController.js';
import { getOverdueLoans } from '../controllers/loansController.js';

import validarJWT from '../middlewares/validarJwt.js';
import tieneRol from '../middlewares/validarRoles.js';
import validarCampos from '../middlewares/validarCampos.js';

import { loanId, createLoanValidators, loanQuery } from '../validators/loansValidators.js';

const router = Router();

// Consultar todos los préstamos: solo ADMIN
router.get('/overdue', 
    validarJWT,
    tieneRol('ADMIN'),
    getOverdueLoans
    );

router.get('/', [
    validarJWT,
    tieneRol('ADMIN'),
    loanQuery,
    validarCampos,
], getLoans);

// Crear préstamo: usuario autenticado
router.post('/', [
    validarJWT,
    createLoanValidators,
    validarCampos,
], createLoan);

// Consultar un préstamo: usuario autenticado
router.get('/:_id', [
    validarJWT,
    loanId,
    validarCampos
], getLoanById);

// Devolver un libro: usuario autenticado
router.patch('/:_id/return', [
    validarJWT,
    loanId,
    validarCampos,
], returnLoan);

export default router;
