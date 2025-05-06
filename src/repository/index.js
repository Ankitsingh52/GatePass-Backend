// const gatePassRepository = require("./gatePassRepository");

module.exports = {
    userRepository: require("./userRepository"),
    gatePassRepository: require("./gatePassRepository"),
    tokenRepository: require('./tokenRepository'),
    inviteSchedulerRepository: require('./inviteSchedulerRepository')
};