const redis = require("redis");
const sub = redis.createClient();
const pub = redis.createClient();
const { Channel } = require("../constants/config");

sub.subscribe(Channel);

exports.Sub =sub;
exports.Pub = pub;
module.exports = exports;