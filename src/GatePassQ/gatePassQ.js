const amqp = require('amqplib');
const { RMQ_URI } = require('../config/serverConfig');
const colors = require('colors');
let connection;
let channel;
let isGatePassConsumer;
async function initRMQ(retries = 10, delay = 3000) {
    while(retries > 0) {
        try {
            if(!channel && !connection) {
                connection = await amqp.connect(RMQ_URI);
                channel = await connection.createChannel();
                console.log('RabbitMQ Connected'.blue.bold);
    
            }
            return channel;
        }
        catch(err) {
            retries--;
            if(retries === 0) {
                console.error('Error connecting to RabbitMQ:', err);
                process.exit(1);
            }
            console.log(err);
            // return err;
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('Retrying RabbitMQ connection...'.red.bold);
                    resolve();
                }, delay);
            });
        }
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



