const net = require("net");
const server = net.createServer();

const processController = require("../dbConnections/processController");
const program = require("../constants/config");
const logger = require("../logger/log");
const redisClient = require("../messageQueue/redisClient");

server.listen(program.PORT, () => {
    logger.info(`The process started with pid ${process.pid} in port ${program.PORT}`);
    processController.createProcess(process.pid,program.PORT,process.memoryUsage().rss,process.cpuUsage().system)
    .then((result)=>{
        logger.info(result);
    });
});
