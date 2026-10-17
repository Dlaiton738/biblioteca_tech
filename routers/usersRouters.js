import { Router } from 'express';

import { createUser } from '../controllers/usersController.js';
import {
    getUsers,
    updateUserRole
} from '../controllers/usersController.js';

import validarJWT from '../middlewares/validarJwt.js';
import tieneRol from '../middlewares/validarRoles.js';

const router = Router();

router.post('/', createUser);

router.get('/', [
    validarJWT,
    tieneRol('ADMIN')
], getUsers);

router.patch('/:id/role', [
    validarJWT,
    tieneRol('ADMIN')
], updateUserRole);

export default router;