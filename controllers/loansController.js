import mongoose from 'mongoose';
import Loan from '../models/loans.js';
import Book from '../models/books.js';
import User from '../models/users.js';

export const getLoans = async (req, res, next) => {
    try {
        const loans = await Loan.find()
            .populate('user', 'name email role')
            .populate('book');

        return res.status(200).json({
            ok: true,
            data: loans
        });
    } catch (error) {
        next(error);
    }
};

export const getOverdueLoans = async (req, res, next) => {
    try {
        const loans = await Loan.find({
            status: 'ACTIVE',
            dueDate: { $lt: new Date() }
        })
            .populate('user', 'name email role')
            .populate('book');

        return res.status(200).json({
            ok: true,
            data: loans
        });
    } catch (error) {
        next(error);
    }
};

export const getLoanById = async (req, res, next) => {
    try {
        const { _id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({
                ok: false,
                msg: 'El identificador del préstamo no es válido'
            });
        }

        const loan = await Loan.findById(_id)
            .populate('user', 'name email role')
            .populate('book');

        if (!loan) {
            return res.status(404).json({
                ok: false,
                msg: 'Préstamo no encontrado'
            });
        }

        const loanUserId = loan.user?._id
            ? loan.user._id.toString()
            : loan.user?.toString();

        if (
            loanUserId !== req.user._id.toString() &&
            req.user.role !== 'ADMIN'
        ) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permiso para consultar este préstamo'
            });
        }

        return res.status(200).json({
            ok: true,
            data: loan
        });
    } catch (error) {
        next(error);
    }
};

export const createLoan = async (req, res, next) => {
    try {
        const user = req.user._id.toString();
        const { book: bookId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({
                ok: false,
                msg: 'El identificador del libro no es válido'
            });
        }

        const existingUser = await User.findOne({
            _id: user,
            active: true
        });

        if (!existingUser) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe o está inactivo'
            });
        }

        const existingLoan = await Loan.findOne({
            user,
            book: bookId,
            status: 'ACTIVE'
        });

        if (existingLoan) {
            return res.status(409).json({
                ok: false,
                msg: 'Ya tienes este libro prestado'
            });
        }

        const activeLoans = await Loan.countDocuments({
            user,
            status: 'ACTIVE'
        });

        if (activeLoans >= 3) {
            return res.status(409).json({
                ok: false,
                msg: 'Límite de préstamos alcanzado'
            });
        }

        const book = await Book.findOneAndUpdate(
            {
                _id: bookId,
                active: true,
                availableCopies: { $gt: 0 }
            },
            {
                $inc: { availableCopies: -1 }
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!book) {
            return res.status(409).json({
                ok: false,
                msg: 'El libro no existe, está inactivo o no tiene copias disponibles'
            });
        }

        const loanDate = new Date();
        const dueDate = new Date(loanDate);
        dueDate.setDate(dueDate.getDate() + 14);

        try {
            const loan = await Loan.create({
                user,
                book: bookId,
                loanDate,
                dueDate
            });

            return res.status(201).json({
                ok: true,
                data: loan
            });
        } catch (error) {
            await Book.updateOne(
                { _id: bookId },
                { $inc: { availableCopies: 1 } }
            );

            throw error;
        }
    } catch (error) {
        next(error);
    }
};

export const returnLoan = async (req, res, next) => {
    try {
        const { _id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({
                ok: false,
                msg: 'El identificador del préstamo no es válido'
            });
        }

        const loan = await Loan.findById(_id);

        if (!loan) {
            return res.status(404).json({
                ok: false,
                msg: 'El préstamo no existe'
            });
        }

        if (
            loan.user.toString() !== req.user._id.toString() &&
            req.user.role !== 'ADMIN'
        ) {
            return res.status(403).json({
                ok: false,
                msg: 'No tienes permiso para devolver este préstamo'
            });
        }

        if (loan.status !== 'ACTIVE') {
            return res.status(400).json({
                ok: false,
                msg: 'Este préstamo ya fue devuelto'
            });
        }

        const book = await Book.findById(loan.book);

        if (!book) {
            return res.status(404).json({
                ok: false,
                msg: 'El libro no existe'
            });
        }

        loan.status = 'RETURNED';
        loan.returnDate = new Date();

        await loan.save();

        book.availableCopies += 1;
        await book.save();

        return res.status(200).json({
            ok: true,
            msg: 'Libro devuelto correctamente',
            data: loan
        });
    } catch (error) {
        next(error);
    }
};
