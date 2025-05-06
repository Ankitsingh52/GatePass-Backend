const { user } = require('../models');

module.exports = {
    authController: require('./authController'),
    gatePassController: require('./gatePassController'),
    userController: require('./userController')
};