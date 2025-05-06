// const { gatePass } = require("./gatePass");

// const scheduleTasks = require("./schedulesSchema");

// const { user } = require("./user");
module.exports = {
    gatePass: require("./gatePass"),
    user: require("./user"),
    token: require("./tokenSchema"),
    scheduleTasks: require("./schedulesSchema")
};