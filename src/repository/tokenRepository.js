const { token }  = require('../models/index');
const crudRepository = require('./crudRepository');
class tokenRepository extends crudRepository {
    constructor() {
        super(token);
    }
}

module.exports = tokenRepository;