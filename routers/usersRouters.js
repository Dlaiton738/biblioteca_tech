import { Router } from 'express';

import {
    createUser,
    getUsers,
    updateUserRole
} from '../controllers/usersController.js';

import validarJWT from '../middlewares/validarJwt.js';
import tieneRol from '../middlewares/validarRoles.js';
import validarCampos from '../middlewares/validarCampos.js';

import {
    userId,
    name,
    email,
    password,
    role
} from '../validators/usersValidators.js';

const router = Router();

// Registro público
router.post('/', [
    name,
    email,
    password,
    validarCampos
], createUser);

// Consultar usuarios: solo ADMIN
router.get('/', [
    validarJWT,
    tieneRol('ADMIN')
], getUsers);

// Cambiar rol: solo ADMIN
router.patch('/:id/role', [
    validarJWT,
    tieneRol('ADMIN'),
    userId,
    role,
    validarCampos
], updateUserRole);

export default router;
