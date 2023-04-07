import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    tokenBitconce: {
        type: Array,
        required: true,
    },
    network: {
        type: String,
        required: true,
    },
    site: {
        type: String,
        required: true,
    },
    currentPurchase: {
        type: Array,
        required: true,
    },
}, {
    timestamps: true,

});

export default mongoose.model('User', UserSchema);