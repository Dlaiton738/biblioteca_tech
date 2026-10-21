import mongoose from 'mongoose';
import Authors from "../models/authors.js";
import Book from "../models/books.js";

export const getAuthors = async (req, res, next) => {
    try {

        
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;

        const filter = { active: true };

        const total = await Authors.countDocuments(filter);
        const authores = await Authors.find(filter)
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            ok: true,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data: authores
        });
    } catch (error) {
        next(error);
    }
};

export const createAuthors = async (req, res, next) => {
    try {
        const { name, nationality, birthYear } = req.body;

        if (!name || name.trim().length < 3 || name.trim().length > 80) {
            return res.status(400).json({
                ok: false,
                msg: "El nombre debe tener entre 3 y 80 caracteres"
            });
        }

        const existingAuthor = await Authors.findOne({
            name: name.trim()
        });

        if (existingAuthor) {
            return res.status(400).json({
                ok: false,
                msg: "Ya existe un autor con ese nombre"
            });
        }

        if (nationality !== undefined &&
            (typeof nationality !== 'string' ||
            nationality.trim().length < 2 ||
            nationality.trim().length > 40)) {
            return res.status(400).json({
                ok: false,
                msg: "La nacionalidad debe tener entre 2 y 40 caracteres"
            });
        }

        if (birthYear !== undefined &&
            (!Number.isInteger(birthYear) ||
            birthYear < 0 ||
            birthYear > new Date().getFullYear())) {
            return res.status(400).json({
                ok: false,
                msg: "El año de nacimiento no es válido"
            });
        }

        const nuevo = await Authors.create({
            name: name.trim(),
            ...(nationality !== undefined
                ? { nationality: nationality.trim() }
                : {}),
            ...(birthYear !== undefined
                ? { birthYear }
                : {})
        });

        return res.status(201).json({
            ok: true,
            data: nuevo
        });
    } catch (error) {
        next(error);
    }
};

export const getAuthorbyID = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                ok: false,
                msg: "El identificador del autor no es válido"
            });
        }

        const author = await Authors.findOne({
            _id: id,
            active: true
        });

        if (!author) {
            return res.status(404).json({
                ok: false,
                msg: "Autor no encontrado"
            });
        }

        return res.status(200).json({
            ok: true,
            data: author
        });
    } catch (error) {
        next(error);
    }
};

export const updateAuthors = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                ok: false,
                msg: "El identificador del autor no es válido"
            });
        }

        const author = await Authors.findById(id);

        if (!author) {
        return res.status(404).json({
        ok: false,
        msg: "Autor no encontrado"
        });
    }

        const { name, nationality, birthYear, active } = req.body;

        if (name !== undefined &&
            (typeof name !== 'string' ||
            name.trim().length < 3 ||
            name.trim().length > 80)) {
            return res.status(400).json({
                ok: false,
                msg: "El nombre debe tener entre 3 y 80 caracteres"
            });
        }

        if (name !== undefined) {
            const existingAuthor = await Authors.findOne({
                name: name.trim(),
                _id: { $ne: id }
            });

            if (existingAuthor) {
                return res.status(400).json({
                    ok: false,
                    msg: "Ya existe un autor con ese nombre"
                });
            }
        }

        if (nationality !== undefined &&
            (typeof nationality !== 'string' ||
            nationality.trim().length < 2 ||
            nationality.trim().length > 40)) {
            return res.status(400).json({
                ok: false,
                msg: "La nacionalidad debe tener entre 2 y 40 caracteres"
            });
        }

        if (birthYear !== undefined &&
            (!Number.isInteger(birthYear) ||
            birthYear < 0 ||
            birthYear > new Date().getFullYear())) {
            return res.status(400).json({
                ok: false,
                msg: "El año de nacimiento no es válido"
            });
        }

        if (active === false) {
            const activeBooks = await Book.exists({
                author: id,
                active: true
            });

            if (activeBooks) {
                return res.status(409).json({
                    ok: false,
                    msg: "No se puede desactivar un autor que tiene libros activos"
                });
            }
        }

        if (name !== undefined) author.name = name.trim();
        if (nationality !== undefined) {
            author.nationality = nationality.trim();
        }
        if (birthYear !== undefined) author.birthYear = birthYear;
        if (active !== undefined) author.active = active;

        await author.save();

        return res.status(200).json({
            ok: true,
            data: author
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAuthors = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                ok: false,
                msg: "El identificador del autor no es válido"
            });
        }

        const author = await Authors.findOne({
            _id: id,
            active: true
        });

        if (!author) {
            return res.status(404).json({
                ok: false,
                msg: "Autor no encontrado"
            });
        }

        const activeBooks = await Book.exists({
            author: id,
            active: true
        });

        if (activeBooks) {
            return res.status(409).json({
                ok: false,
                msg: "No se puede desactivar un autor que tiene libros activos"
            });
        }

        author.active = false;
        await author.save();

        return res.status(200).json({
            ok: true,
            msg: "Autor desactivado correctamente"
        });
    } catch (error) {
        next(error);
    }
};