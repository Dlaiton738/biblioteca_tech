
import { Schema, model } from 'mongoose';

const LoanSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },

    loanDate: {
        type: Date,
        default: Date.now,
        required: true
    },

    dueDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return !value || !this.loanDate || value >= this.loanDate;
            },
            message: 'La fecha de vencimiento no puede ser anterior a la fecha del préstamo.'
        }
    },

    returnDate: {
        type: Date,
        default: null,
        // validate: {
        //     validator: function (value) {
        //         return value >= this.loanDate;
        //     },
        //     message: 'La fecha de devolución no puede ser anterior a la fecha del préstamo.'
        // }
    },

    status: {
        type: String,
        enum: ['ACTIVE', 'RETURNED'],
        default: 'ACTIVE',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Loan', LoanSchema);
