const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const ApiRoutes = require('./routes/index');
const colors = require('colors');
let { PORT, MONGO_URI, REDIS_URI } = require('./config/serverConfig');
const configs = require('./config/configs.json');
const Redis = require('ioredis'); 
const dotenv = require('dotenv');
const { initRMQ } = require('./GatePassQ/gatePassQ');
const { consumeJob } = require('./GatePassQ/consumer');
dotenv.config();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/home', (req, res) => {
    return res.send('Welcome to the Gate Pass System');
}
);
app.use('/api', ApiRoutes);

// Server Setup and Start
async function setupAndStartServer() {
    try {
        // handleEnvVars();
        // Start MongoDB
        await mongoose.connect(MONGO_URI);
        console.log(`Server connected to DB:`.cyan.bold, `gatePassDB`.red.bold);

        // Initialize Redis
        // await initializeRedis();
        await initRMQ();
        await consumeJob();

        // Start Express server
        app.listen(PORT, () => {
            console.log(`Server started running at PORT:`.magenta.bold, `${PORT}`.yellow.bold);
        });
    } catch (err) {
        console.error('Error while starting the server:', err);
    }
}

setupAndStartServer();

// module.exports = redisClient; 
