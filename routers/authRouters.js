import { Router } from "express";

import {
    register,
    login,
    me
} from "../controllers/auth.js";

import validarJWT from "../middlewares/validarJwt.js"

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", validarJWT, me);

export default router;