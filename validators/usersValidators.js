import { check } from "express-validator";

const userId = check("id")
    .isMongoId()
    .withMessage("El ID debe ser un ID de MongoDB válido");

const name = check("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .bail()
    .isLength({ min: 3, max: 60 })
    .withMessage("El nombre debe tener entre 3 y 60 caracteres");

const email = check("email")
    .trim()
    .isEmail()
    .withMessage("El correo electrónico no es válido")
    .normalizeEmail();

const password = check("password")
    .isString()
    .withMessage("La contraseña debe ser texto")
    .bail()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener mínimo 6 caracteres");

const role = check("role")
    .isIn(["USER", "ADMIN"])
    .withMessage("El rol debe ser USER o ADMIN");

export {
    userId,
    name,
    email,
    password,
    role
};
