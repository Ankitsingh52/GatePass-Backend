const QUEUE = require('../config/serverConfig').GATE_PASS_QUEUE;//process.env.GATE_PASS_QUEUE//'GatePass_Queue';
const { initRMQ } = require('./gatePassQ');
const { gatePassService } = require('../services/index');
const jobNames = require('./jobNames.json');
const MAX_RETRIES = 3;
let retryCount =  0;
async function consumeJob() {
  try {
    const channel = await initRMQ();//await connection.createChannel();
    await channel.assertQueue(QUEUE, { durable: true });
    console.log('GatePass Consumer: Running'.gray.bgWhite.bold);
    channel.consume(QUEUE, async (msg) => {
      if (msg !== null) {
        const job = JSON.parse(msg.content.toString());
        if(job.task == "Process Gate Pass Request") {
          console.log('Received job:', JSON.stringify(job));
          const gatePassServiceInst = new gatePassService();
          try {
            let gatePass = await gatePassServiceInst.createGatePass(job.data);
            channel.ack(msg);
            return gatePass;
          }
          catch(err) {
            retryCount += 1;
            console.log(err);
            if(retryCount <= MAX_RETRIES) {
              channel.nack(msg, false, true);
            }
            else {
              channel.nack(msg, false, false);
            }
          }
        }
        else if(job.task == "Approve Gate Pass Request") {

        }
      }
    });
  }
  catch (err) {
    // retryCount += 1;
    // console.log(err);
    // if(retryCount <= MAX_RETRIES) {
    //   channel.nack(msg, false, true);
    // }
    // else {
    //   channel.nack(msg, false, false);
    // }
    // return;
    // return Promise.reject(err);
    console.log(err);
  }
}

module.exports = {
  consumeJob
};
