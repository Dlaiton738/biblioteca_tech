
import { check, param, query } from 'express-validator';


const loanId = param('_id')
    .isMongoId()
    .withMessage('El ID del préstamo no es válido');


const user = check('user')
    .isMongoId()
    .withMessage('El ID del usuario no es válido');


const book = check('book')
    .isMongoId()
    .withMessage('El ID del libro no es válido');


const dueDate = check('dueDate')
    .isISO8601()
    .withMessage('La fecha límite de devolución no es válida')
    .toDate();


const createLoanValidators = [
    user,
    book,
    dueDate
];
    
const loanQuery = [
    query('estado')
        .optional()
        .isIn(['ACTIVE', 'RETURNED'])
        .withMessage('El estado debe ser ACTIVE o RETURNED'),

    query('usuario')
        .optional()
        .isMongoId()
        .withMessage('El ID del usuario no es válido')
];

export {
    loanId,
    createLoanValidators,
    loanQuery
};