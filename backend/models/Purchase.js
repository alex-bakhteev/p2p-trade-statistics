import mongoose from 'mongoose';

const PurcahseSchema = new mongoose.Schema({
    exchangeBuy: {
        type: Array,
        required: true,
    },
    amount: {
        type: Array,
        required: true,
    },
    fulfilled: {
        type: Boolean,
        required: true,
    },
    averageExchange: {
        type: Number,
        required: true,
    },
    allAmount: {
        type: Number,
        required: true,
    },
    datePurchase: {
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

export default mongoose.model('Purchase', PurcahseSchema);