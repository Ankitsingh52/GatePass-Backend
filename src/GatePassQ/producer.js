const { initRMQ } = require('./gatePassQ');
const jobNames = require('./jobNames.json');

async function publishJob(jobData) {
  try {
    let self = this;
    console.log('PBG::', self.userContext);
    if(self?.userContext?.department) {
      jobData.dept = self.userContext.department;
    }
    if(self?.userContext?.name) {
      jobData.dept = self.userContext.name;
    }
    if(self?.userContext?.email) {
      jobData.dept = self.userContext.email;
    }
    const QUEUE = require('../config/serverConfig').GATE_PASS_QUEUE;//process.env.GATE_PASS_QUEUE;//'GatePass_Queue';
    // await channel.assertQueue(QUEUE, { durable: true });
    const channel = await initRMQ();
    await channel.assertQueue(QUEUE, { durable: true });
    const job = { task: jobData.jobType, data: jobData };
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(job)), { persistent: true });

    console.log('Job sent:', job);
  }
  catch(err) {
    console.log(err);
  }
}

// async function approveGatePassRequest(jobData) {

// }

module.exports = { 
  publishJob
};
