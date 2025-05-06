const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    taskName: {
        type: String,
        required: true
    },
    executionTime: {
        type: Date,
        default: Date.now
    },
    taskDetails: {
        type: Schema.Types.Mixed
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive']
    }
});

const scheduleTasks = new mongoose.model('scheduledTask', scheduleSchema);

module.exports = scheduleTasks;