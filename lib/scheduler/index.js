const ProcessController = require("./process.js");
const net = require("net");
const logger = require("../logger/log");
const redisSubClient = require("../messageQueue/redisSubscribeClient");
const {program} = require("../constants/config");
const redisClient = require("../messageQueue/redisClient");

const processController = new ProcessController(redisClient);
const server = net.createServer();
server.listen(program.PORT, () => {
    logger.info(`The process started with pid ${process.pid} in port ${program.PORT}`);
    processController.storeProcess(process.pid, program.PORT, process.memoryUsage().rss, process.cpuUsage().system);

    /* redis subscribe client to subscribe on the jobs from the channel */
    redisSubClient.on("subscribe", (channel, count) => {
        logger.info("Subscribed to " + channel + ". Now subscribed to " + count + " channel(s).");
    });

    redisSubClient.on("message", (channel, message) => {
        logger.info(`Message from channel ${channel} : ${message}`);
        processController.startProcessing();
    });

    redisSubClient.subscribe(program.CHANNEL);
});