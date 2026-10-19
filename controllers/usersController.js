import Users from "../models/users.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (
            typeof name !== "string" ||
            name.trim().length < 3 ||
            name.trim().length > 60
        ) {
            return res.status(400).json({
                ok: false,
                msg: "El nombre debe tener entre 3 y 60 caracteres"
            });
        }

        if (
            typeof email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ) {
            return res.status(400).json({
                ok: false,
                msg: "El correo electrónico no es válido"
            });
        }

        if (typeof password !== "string" || password.length < 6) {
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

        const newUser = await Users.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        return res.status(201).json({
            ok: true,
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                active: newUser.active
            }
        });
    } catch (error) {
        next(error);
    }
};



export const getUsers = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(
            50,
            Math.max(1, parseInt(req.query.limit) || 10)
        );

        const skip = (page - 1) * limit;

        const [total, users] = await Promise.all([
            Users.countDocuments(),
            Users.find()
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
        ]);

        return res.status(200).json({
            ok: true,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data: users
        });
    } catch (error) {
        next(error);
    }
};


export const updateUserRole = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { role } = req.body;

        if (!["USER", "ADMIN"].includes(role)) {
            return res.status(400).json({
                ok: false,
                msg: "El rol debe ser USER o ADMIN"
            });
        }

        const user = await Users.findById(id);

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no encontrado"
            });
        }

        user.role = role;
        await user.save();

        const { password, ...userSinPassword } = user.toObject();

        return res.status(200).json({
            ok: true,
            data: userSinPassword
        });
    } catch (error) {
        next(error);
    }
};
