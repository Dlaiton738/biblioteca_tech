import { check } from "express-validator";


//validar nombre de author

const authorsId = check("id")
.isMongoId(). withMessage("el id debe ser un id de mongo valido")

const  name = check("name")
.trim()
.notEmpty()
.withMessage("el nombre es obligatorio")
.bail()
.isLength({min: 3, max:50})
.withMessage("el nombre debe tener entre 3 y 50 caracteres");

const nacionality = check("nacionalityq")
.trim()
.notEmpty()
.withMessage("el nombre es obligatorio")
.bail()
.isLength({min: 2, max:50})
.withMessage("la nacionalidad debe tener entre 2 y 50 caracteres");

const birthyear = check("birthyear")
.notEmpty()
.withMessage("el año de nacimiento es obligatorio")
.bail()
.isInt({
    min: 1,
    max: new Date().getFullYear(),
})
.withMessage("El año de nacimiento debe ser un entero valido")
.toInt()

const active = check("active")

.optional()
.isBoolean()
.withMessage("el campo active debe ser verdadero o false")
.toBoolean();

export{
    authorsId,
    name,
    nacionality,
    birthyear,
    active,
};