import { check } from "express-validator";

// Validar el ID del autor
const authorsId = check("id")
    .isMongoId()
    .withMessage("El ID debe ser un ID de MongoDB válido");

// Validar el nombre al crear un autor
const name = check("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .bail()
    .isLength({ min: 3, max: 80 })
    .withMessage("El nombre debe tener entre 3 y 80 caracteres");

// Validar el nombre al actualizar un autor
const optionalName = check("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .bail()
    .isLength({ min: 3, max: 80 })
    .withMessage("El nombre debe tener entre 3 y 80 caracteres");

const nationality = check("nationality")
    .optional()
    .trim()
    .isLength({ min: 2, max: 40 })
    .withMessage("La nacionalidad debe tener entre 2 y 40 caracteres");

const birthYear = check("birthYear")
    .optional()
    .isInt({
        min: 0,
        max: new Date().getFullYear()
    })
    .withMessage("El año de nacimiento debe ser un entero válido")
    .toInt();

const active = check("active")
    .optional()
    .isBoolean()
    .withMessage("El campo active debe ser verdadero o falso")
    .toBoolean();

export {
    authorsId,
    name,
    optionalName,
    nationality,
    birthYear,
    active
};
