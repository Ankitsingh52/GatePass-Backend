const { inviteSchedulerRepository } = require('../repository/index');

class inviteSchedulerService {
    constructor() {
        this.inviteSchedulerRepositoryInst = new inviteSchedulerRepository();
    }

    async storeSchedule(schedule) {
        try {
            let savedScheduleAck = await this.inviteSchedulerRepositoryInst.create(schedule);
            return savedScheduleAck;
        }
        catch(err) {
            console.log(err);
            // throw err;
            return err;
        }
    }

    async endSchedule(scheduleId) {
        try {//status
            let endScheduleAck = await this.inviteSchedulerRepositoryInst.update(
                {_id: scheduleId}, 
                {'$set': {status: 'Inactive'}
            });
            return endScheduleAck;
        }
        catch(err) {
            console.log(err);
            return err;
        }
    }

    async scheduleInvite(taskData) {
        
    }

    async scheduleAllInvites() {
        //Re-Scheduling invites in case of server restarts for active schedules
        try {
            let fetchSchedules = await this.inviteSchedulerRepositoryInst.getAll({status: 'Active'});
            if(fetchSchedules?.length) {
                fetchSchedules.forEach((schdl) => {
                    this.scheduleInvite(schdl);
                });
            }
            return;
        }
        catch(err) {
            console.log(err);
            return err;
        }
    }
}

module.exports = inviteSchedulerService;