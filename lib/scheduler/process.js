const processController = require("../dbConnections/processController");
const net = require("net");
const server = net.createServer();
const program = require("../constants/config");
const logger = require("../logger/log");
server.listen(program.PORT, () => {
    logger.info(`The process started with pid ${process.pid} in port ${program.PORT}`);
    processController.createProcess(process.pid,process.env.PORT,process.memoryUsage().rss,process.cpuUsage().system)
    .then((response)=>{
        logger.info(response);
    });
});
