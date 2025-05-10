const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    REDIS_URI: process.env.REDIS_URI,
    GATE_PASS_QUEUE: process.env.GATE_PASS_QUEUE,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    REDIS_EXPIRY: process.env.REDIS_EXPIRY,
    RMQ_URI: process.env.RMQ_URI
};