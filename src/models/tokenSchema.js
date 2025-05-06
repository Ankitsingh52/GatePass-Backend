const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    isValid: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '6h'
    }
});

const token = new mongoose.model('token', tokenSchema);
module.exports = token;