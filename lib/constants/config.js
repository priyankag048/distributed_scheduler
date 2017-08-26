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
    .usage("test")
    .option("-dh, --PGHOST <s>", "value for dbHost", validateString)
    .option("-dp, --PGPORT <n>", "value for dbPort", parseInt)
    .option("-du, --PGUSER <s>", "value for dbUser", validateString)
    .option("-dP, --PGPASSWORD <s>", "value for dbPassword", validateString)
    .option("-dd, --PGDATABASE <s>", "value for dbName", validateString)
    .option("-p, --PORT <n>","value for port", parseInt);

program.parse(process.argv);

module.exports = program;