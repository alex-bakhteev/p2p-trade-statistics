import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    exchange: {
        type: String,
        required: true,
    },
    received: {
        type: String,
        required: true,
    },
    usdt: {
        type: String,
        required: true,
    },
    date: {
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

export default mongoose.model('Order', OrderSchema);