import { check, query } from 'express-validator';

// ID del libro en los parámetros de la URL
const bookId = check('id')
    .isMongoId()
    .withMessage('El ID del libro no es válido');

// Campos del libro
const title = check('title')
    .trim()
    .notEmpty()
    .withMessage('El título es obligatorio')
    .bail()
    .isLength({ min: 1, max: 120 })
    .withMessage('El título debe tener entre 1 y 120 caracteres');

const isbn = check('isbn')
    .isString()
    .withMessage('El ISBN debe ser texto')
    .bail()
    .matches(/^(\d{10}|\d{13})$/)
    .withMessage('El ISBN debe tener 10 o 13 dígitos');

const author = check('author')
    .isMongoId()
    .withMessage('El ID del autor no es válido');

const genre = check('genre')
    .isIn([
        'novela',
        'cuento',
        'poesia',
        'ensayo',
        'tecnologia',
        'historia',
        'infantil'
    ])
    .withMessage('El género no es válido');

const year = check('year')
    .optional()
    .isInt({ min: 1, max: new Date().getFullYear() })
    .withMessage('El año debe ser un entero válido y no superar el año actual')
    .toInt();

const totalCopies = check('totalCopies')
    .isInt({ min: 1 })
    .withMessage('El total de copias debe ser un entero mayor que cero')
    .toInt();

const active = check('active')
    .optional()
    .isBoolean()
    .withMessage('El estado active debe ser true o false')
    .toBoolean();

// Validadores para crear un libro: campos obligatorios
const createBookValidators = [
    title,
    isbn,
    author,
    genre,
    year,
    totalCopies,
    active
];

// Validadores para actualizar: los campos se pueden omitir
const updateBookValidators = [
    title.optional(),
    isbn.optional(),
    author.optional(),
    genre.optional(),
    year,
    totalCopies.optional(),
    active
];

// Validadores de paginación, filtros, búsqueda y orden
const bookQuery = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('page debe ser un entero mayor que cero')
        .toInt(),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('limit debe ser un entero entre 1 y 50')
        .toInt(),

    query('genre')
        .optional()
        .isIn([
            'novela',
            'cuento',
            'poesia',
            'ensayo',
            'tecnologia',
            'historia',
            'infantil'
        ])
        .withMessage('El género no es válido'),

    query('active')
        .optional()
        .isIn(['true', 'false'])
        .withMessage('active debe ser true o false'),

    query('title')
        .optional()
        .trim()
        .isLength({ min: 1, max: 120 })
        .withMessage('La búsqueda por título debe tener entre 1 y 120 caracteres'),

    query('sortBy')
        .optional()
        .isIn(['title', 'year', 'createdAt'])
        .withMessage('El campo de ordenamiento no es válido'),

    query('order')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('El orden debe ser asc o desc')
];

export {
    bookId,
    createBookValidators,
    updateBookValidators,
    bookQuery
};
