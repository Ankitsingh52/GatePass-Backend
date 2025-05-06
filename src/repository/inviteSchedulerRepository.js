const crudRepository = require('./crudRepository');
const { scheduleTasks } = require('../models/index');
class inviteSchedulerRepository extends crudRepository {
    constructor() {
        super(scheduleTasks);
    }
}

module.exports = inviteSchedulerRepository;