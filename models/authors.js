import { Schema, model } from 'mongoose';

//LAITONNNNNNNNN LOS TIPOS DE DATOS VAN EN MAYUSCULA 

const AuthorsSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 80
    },

    nationality: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 40
    },

    birthYear: {
        type: Number,
        validate: {
            validator: function (value) {
                return value === undefined ||
                    (Number.isInteger(value) &&
                    value >= 0 &&
                    value <= new Date().getFullYear());
            },
            message: 'El año de nacimiento debe ser un entero entre 0 y el año actual.'
        }
    },

    active: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true,
    versionKey: false
});

export default model('Author', AuthorsSchema);