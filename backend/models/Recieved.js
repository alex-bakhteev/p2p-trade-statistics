import mongoose from 'mongoose';

const RecievedSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    exchangeBuyID: {
        type: String,
        required: true,
    },
    exchangeBuy: {
        type: String,
        required: true,
    },
    exchangePlatform: {
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
    earn: {
        type: Number,
        required: true,
    },
    spread: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
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

export default mongoose.model('Recieved', RecievedSchema);