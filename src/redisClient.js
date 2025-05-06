const Redis = require('ioredis'); 
const configs = require('./config/configs.json');
const { REDIS_URI } = require('./config/serverConfig');
const colors = require('colors');
const { promisify } = require('util');
// const redisGetAsync = promisify(redisClient.get).bind(redisClient);

// async function initializeRedis() {
    let redisClient = new Redis(REDIS_URI); 
    redisClient.on('connect', () => {
        console.log('Redis client connected'.green.bold);
    });

    redisClient.on('error', (err) => {
        console.error('Redis connection error:', err);
    });
// }
const redisGetAsync = promisify(redisClient.get).bind(redisClient);

// console.log('redisC::::', redisClient);

module.exports = {
    redisClient,
    redisGetAsync
};