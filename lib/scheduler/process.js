const net = require("net");
const server = net.createServer();

const processController = require("../dbConnections/processController");
const { Program } = require("../constants/config");
const logger = require("../logger/log");
const { Sub } = require("../messageQueue/channel");
server.listen(Program.PORT, () => {
    logger.info(`The process started with pid ${process.pid} in port ${Program.PORT}`);
    processController.createProcess(process.pid,Program.PORT,process.memoryUsage().rss,process.cpuUsage().system)
    .then((response)=>{
        logger.info(response);
        Sub.on("message",(channel,message)=>{
            logger.info(`sub channel ${channel} : ${message}`);
        })
    });
});
