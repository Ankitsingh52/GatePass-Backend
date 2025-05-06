const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gatePassSchema = new Schema({
    // studentId: {
    //     type: String,
    //     required: true
    // },
    // rollNo: {
    //     type: String,
    //     required: true
    // },
    // year: {
    //     type: String,
    //     enum: ['1st year', '2nd Year', '3rd Year', '4th Year'],
    //     required: true
    // },
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    applyReason: {
        type: String,
        required: true
    },
    rejectionReason: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'withdrawn'],
        default: 'pending',
        required: true
    },
    duration: {
        type: String,
        enum: ["Full Day", "Forenoon", "Afternoon"],
        default: "Full Day"
    },
    cOn: {
        type: Date,
        default: Date.now
    },
    mOn: {
        type: Date,
        default: Date.now    
    },
    approvers: {
        type: Schema.Types.Mixed
    },
    approvedBy: {
        type: String
    }
});

const gatePass = new mongoose.model('gatePass', gatePassSchema);

module.exports = gatePass;

