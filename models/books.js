import { Schema, model } from 'mongoose';

const BookSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 120
    },

    isbn: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function (value) {
                return /^\d{10}$|^\d{13}$/.test(value);
            },
            message: 'El ISBN debe contener exactamente 10 o 13 dígitos.'
        }
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },

    genre: {
        type: String,
        required: true,
        enum: [
            'novela',
            'cuento',
            'poesia',
            'ensayo',
            'tecnologia',
            'historia',
            'infantil'
        ]
    },

    year: {
        type: Number,
        validate: {
            validator: function (value) {
                return value === undefined ||
                    value === null ||
                    (
                        Number.isInteger(value) &&
                        value >= 1 &&
                        value <= new Date().getFullYear()
                    );
            },
            message: 'El año debe ser un número entero positivo y no puede superar el año actual.'
        }
    },

    totalCopies: {
        type: Number,
        required: true,
        min: 1,
        validate: {
            validator: Number.isInteger,
            message: 'El total de copias debe ser un número entero.'
        }
    },

    availableCopies: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: 'Las copias disponibles deben ser un número entero.'
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

// Valida que las copias disponibles no superen el total.
BookSchema.pre('validate', function () {
    if (
        Number.isInteger(this.totalCopies) &&
        Number.isInteger(this.availableCopies) &&
        this.availableCopies > this.totalCopies
    ) {
        this.invalidate(
            'availableCopies',
            'Las copias disponibles no pueden superar el total de copias.'
        );
    }
});

export default model('Book', BookSchema);
