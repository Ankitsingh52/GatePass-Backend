const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    role: {
        type: String,
        enum: ['student', 'hod', 'vice-hod', 'admin', 'coordinator'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    },
    rollno: {
        type: String,
        unique: true
    },
    college: {
        type: String
    },
    course: {
        type: String
    },
    year: {
        type: String,
        enum: ['1st year', '2nd Year', '3rd Year', '4th Year']
    },
    department: {
        type: String,
        enum: ['CIV', 'MECH', 'EEE', 'ECE', 'CSE', 'CSM', 'CSC', 'CSD', 'AIML', 'AIDS']
    },
    gatePassCount: {
        type: Number,
        default: 0
    },
    countUpdatedOn: {
        type: Date,
        default: Date.now
    },
    mobNum: {
        type: Number
    },
    cOn: {
        type: Date,
        default: Date.now
    },
    mOn: {
        type: Date,
        default: Date.now
    },
    lastRefreshDate: {
        type: Date
    },
    tokenVersion: {
        type: Number,
        default: 0
    }
});

const user = new mongoose.model('user', userSchema);

module.exports = user;

