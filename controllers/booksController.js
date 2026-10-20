import mongoose from 'mongoose';
import Book from '../models/books.js';
import Loan from '../models/loans.js';
import Authors from '../models/authors.js';


export const getBooks = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;

        const filter = {};

        // Filtrar por género
        if (req.query.genre) {
            filter.genre = req.query.genre;
        }

        // Filtrar por estado activo
        if (req.query.active !== undefined) {
            if (!['true', 'false'].includes(req.query.active)) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El filtro active debe ser true o false'
                });
            }

            filter.active = req.query.active === 'true';
        }

        // Buscar por título, sin distinguir mayúsculas y minúsculas
        if (req.query.title) {
            filter.title = {
                $regex: req.query.title.trim(),
                $options: 'i'
            };
        }

        // Ordenar resultados
        const allowedSortFields = ['title', 'year', 'createdAt'];
        const sortBy = req.query.sortBy || 'title';
        const order = req.query.order || 'asc';

        if (!allowedSortFields.includes(sortBy)) {
            return res.status(400).json({
                ok: false,
                msg: 'El campo de ordenamiento no es válido'
            });
        }

        if (!['asc', 'desc'].includes(order)) {
            return res.status(400).json({
                ok: false,
                msg: 'El orden debe ser asc o desc'
            });
        }

        const sort = {
            [sortBy]: order === 'asc' ? 1 : -1
        };

        const [total, books] = await Promise.all([
            Book.countDocuments(filter),
            Book.find(filter)
                .populate('author', 'name')
                .sort(sort)
                .skip(skip)
                .limit(limit)
        ]);

        return res.status(200).json({
            ok: true,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            books
        });
    } catch (error) {
        next(error);
    }
};


export const availableBooks = async (req, res, next) => {
    try {
        const books = await Book.find({
            active: true,
            availableCopies: { $gt: 0 }
        }).populate('author', 'name');

        return res.status(200).json({
            ok: true,
            books
        });
    } catch (error) {
        next(error);
    }
};

export const getBookById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                ok: false,
                msg: 'El identificador del libro no es válido'
            });
        }

        const book = await Book.findById(id)
            .populate('author', 'name');

        if (!book) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró el libro'
            });
        }

        return res.status(200).json({
            ok: true,
            book
        });
    } catch (error) {
        next(error);
    }
};

export const createBook = async (req, res, next) => {
    try {
        const { author } = req.body;

        if (!mongoose.Types.ObjectId.isValid(author)) {
            return res.status(400).json({
                ok: false,
                msg: 'El identificador del autor no es válido'
            });
        }

        const existingAuthor = await Authors.findOne({
            _id: author,
            active: true
        });

        if (!existingAuthor) {
            return res.status(400).json({
                ok: false,
                msg: 'El autor no existe o está inactivo'
            });
        }

        const { totalCopies, ...datosLibro } = req.body;

        const nuevo = await Book.create({
            ...datosLibro,
            totalCopies,
            availableCopies: totalCopies
        });

        return res.status(201).json({
            ok: true,
            book: nuevo
        });
    } catch (error) {
        // if (error.code === 11000) {
        //     return res.status(400).json({
        //         ok: false,
        //         msg: 'Ya existe un libro con ese ISBN'
        //     });
        // }

        // if (error.name === 'ValidationError' || error.name === 'CastError') {
        //     return res.status(400).json({
        //         ok: false,
        //         msg: error.message
        //     });
        // }

        next(error);
    }
};

export const updateBook = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                ok: false,
                msg: 'El identificador del libro no es válido'
            });
        }

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró el libro'
            });
        }

        const { totalCopies, availableCopies, author } = req.body;

        if (author !== undefined) {
            if (!mongoose.Types.ObjectId.isValid(author)) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El identificador del autor no es válido'
                });
            }

            const existingAuthor = await Authors.findOne({
                _id: author,
                active: true
            });

            if (!existingAuthor) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El autor no existe o está inactivo'
                });
            }

            book.author = author;
        }

        if (totalCopies !== undefined) {
            if (!Number.isInteger(totalCopies) || totalCopies < 1) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El total de copias debe ser un entero mayor que cero'
                });
            }

            const activeLoans = await Loan.countDocuments({
                book: book._id,
                status: 'ACTIVE'
            });

            if (totalCopies < activeLoans) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El total de copias no puede ser menor que las copias prestadas'
                });
            }

            book.totalCopies = totalCopies;
            book.availableCopies = totalCopies - activeLoans;
        }

        if (availableCopies !== undefined && totalCopies === undefined) {
            return res.status(400).json({
                ok: false,
                msg: 'Las copias disponibles se calculan automáticamente al actualizar el total'
            });
        }

        if (req.body.active === false && book.active === true) {
            const activeLoans = await Loan.countDocuments({
                book: book._id,
                status: 'ACTIVE'
            });

            if (activeLoans > 0) {
                return res.status(409).json({
                    ok: false,
                    msg: 'No se puede desactivar un libro que tiene préstamos activos'
                });
            }
        }

        const fields = [
            'title',
            'isbn',
            'genre',
            'year',
            'active'
        ];

        for (const field of fields) {
            if (req.body[field] !== undefined) {
                book[field] = req.body[field];
            }
        }

        await book.save();

        return res.status(200).json({
            ok: true,
            book
        });
    } catch (error) {
        // if (error.code === 11000) {
        //     return res.status(400).json({
        //         ok: false,
        //         msg: 'Ya existe un libro con ese ISBN'
        //     });
        // }

        // if (error.name === 'ValidationError' || error.name === 'CastError') {
        //     return res.status(400).json({
        //         ok: false,
        //         msg: error.message
        //     });
        // }

        next(error);
    }
};


export const deleteBook = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                ok: false,
                msg: 'El identificador del libro no es válido'
            });
        }

        const book = await Book.findById(id);

        if (!book || !book.active) {
            return res.status(404).json({
                ok: false,
                msg: 'Libro no encontrado o ya está desactivado'
            });
        }

        const activeLoans = await Loan.countDocuments({
            book: book._id,
            status: 'ACTIVE'
        });

        if (activeLoans > 0) {
            return res.status(409).json({
                ok: false,
                msg: 'No se puede desactivar un libro que tiene préstamos activos'
            });
        }

        book.active = false;
        await book.save();

        return res.status(200).json({
            ok: true,
            msg: 'Libro desactivado correctamente'
        });
    } catch (error) {
        next(error);
    }
};

