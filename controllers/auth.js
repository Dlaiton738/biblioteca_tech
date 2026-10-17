import Users from "../models/users.js";
import bcrypt from "bcryptjs";
import generarJWT from "../helpers/generarJwt.js";

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || name.trim().length < 3 || name.trim().length > 60) {
            return res.status(400).json({
                ok: false,
                msg: "El nombre debe tener entre 3 y 60 caracteres"
            });
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                ok: false,
                msg: "El correo electrónico no es válido"
            });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({
                ok: false,
                msg: "La contraseña debe tener mínimo 6 caracteres"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await Users.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                ok: false,
                msg: "Ya existe un usuario con ese correo"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Users.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "USER"
        });

        const token = await generarJWT(user._id.toString());

        return res.status(201).json({
            ok: true,
            user,
            token
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                msg: "Ingrese el correo y la contraseña"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await Users.findOne({
            email: normalizedEmail,
            active: true
        });

        if (!user) {
            return res.status(401).json({
                ok: false,
                msg: "Credenciales inválidas"
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                ok: false,
                msg: "Credenciales inválidas"
            });
        }

        const token = await generarJWT(user._id.toString());

        return res.status(200).json({
            ok: true,
            user,
            token
        });
    } catch (error) {
        next(error);
    }
};

export const me = async (req, res, next) => {
    try {
        return res.status(200).json({
            ok: true,
            user: req.user
        });
    } catch (error) {
        next(error);
    }
};