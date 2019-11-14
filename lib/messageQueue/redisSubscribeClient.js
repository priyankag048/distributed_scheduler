const redis = require("redis");
const program = require("../constants/config");
const client = redis.createClient(program.REDISPORT,program.REDISHOST);

module.exports = client;