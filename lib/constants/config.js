const program = require("commander");
const _ = require("lodash");
const logger = require("../logger/log");

function validateString(val){
    if(_.isString(val)){
        return val;
    }else{
        logger.error("Not a valid string");
    }
}

program
    .version("0.1.0")
    .option("-dh, --PGHOST <s>", "value for dbHost", validateString)
    .option("-dp, --PGPORT <n>", "value for dbPort", parseInt)
    .option("-du, --PGUSER <s>", "value for dbUser", validateString)
    .option("-dP, --PGPASSWORD <s>", "value for dbPassword", validateString)
    .option("-dd, --PGDATABASE <s>", "value for dbName", validateString)
    .option("-p, --PORT <n>","value for port", parseInt)
    .option("-rp, --REDISPORT <n>","value for redis port", parseInt)
    .option("-rp, --REDISHOST <s>","value for redis host", validateString)
    .option("-s --PROCESS_STORE <s>","value for redis process store", validateString) 
    .option("-js --JOB_STORE <s>","value for redis job store", validateString) 
    .option("-js --JOB_PROCESSED <s>","value for processed job store", validateString) 
    .option("-ch --CHANNEL <s>","value for redis channel", validateString);

program.parse(process.argv);

exports.program = program;
exports.validateString = validateString;
module.exports = exports;