import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    allDate: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,

});

export default mongoose.model('Payment', PaymentSchema);