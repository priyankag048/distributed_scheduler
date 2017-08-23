const processController = require('../dbConnections/processController');
const net = require('net');
const server = net.createServer();
const logger = require('../logger/log');

server.listen(process.env.PORT, () => {
    logger.info(`The process started with pid ${process.pid} in port ${process.env.PORT}`);
    processController.createProcess(process.pid,process.env.PORT,process.memoryUsage().rss,process.cpuUsage().system)
    .then((result)=>{
        logger.info(result.message);
    })
    .catch((err)=>{
        logger.error(err);
    })
});
