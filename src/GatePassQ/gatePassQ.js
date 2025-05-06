const amqp = require('amqplib');
const RABBITMQ_URL = 'amqp://127.0.0.1:5672';
const colors = require('colors');
let connection;
let channel;
let isGatePassConsumer;
async function initRMQ() {
    try {
        if(!channel && !connection) {
            connection = await amqp.connect(RABBITMQ_URL);
            channel = await connection.createChannel();
            console.log('RabbitMQ Connected'.blue.bold);

        }
        return channel;
    }
    catch(err) {
        console.log(err);
        process.exit(1);
        // return err;
    }
}

async function closeRMQ() {
    try {
        if(connection) {
            await connection.close();
        }
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {
    initRMQ,
    closeRMQ
};



