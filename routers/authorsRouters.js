import { Router } from "express";

import {
    createAuthors,
    getAuthors,
    getAuthorbyID,
    updateAuthors,
    deleteAuthors
} from "../controllers/authorsController.js";

import validarJWT from "../middlewares/validarJwt.js";
import tieneRol from "../middlewares/validarRoles.js";
import validarCampos from "../middlewares/validarCampos.js";

import {
    authorsId,
    name,
    optionalName,
    nationality,
    birthYear,
    active
} from "../validators/authorsValidators.js";

const router = Router();

router.get("/", getAuthors);

router.post("/", [
    validarJWT,
    tieneRol("ADMIN"),
    name,
    nationality,
    birthYear,
    validarCampos
], createAuthors);

router.get("/:id", [
    authorsId,
    validarCampos
], getAuthorbyID);

router.patch("/:id", [
    validarJWT,
    tieneRol("ADMIN"),
    authorsId,
    optionalName,
    nationality,
    birthYear,
    active,
    validarCampos
], updateAuthors);

router.put("/:id", [
    validarJWT,
    tieneRol("ADMIN"),
    authorsId,
    optionalName,
    nationality,
    birthYear,
    active,
    validarCampos
], updateAuthors);

router.delete("/:id", [
    validarJWT,
    tieneRol("ADMIN"),
    authorsId,
    validarCampos
], deleteAuthors);

export default router;
