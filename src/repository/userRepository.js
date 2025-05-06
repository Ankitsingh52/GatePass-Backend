const userModel = require('../models/user');
const crudRepository = require('./crudRepository');

class userRepository extends crudRepository{
    constructor() {
        super(userModel);
    }
};

module.exports = userRepository;