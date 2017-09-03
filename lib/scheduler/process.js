const net = require("net");
const vm = require("vm");
const async = require("async");
const redisSubClient = require("../messageQueue/redisSubscribeClient");
const redisClient = require("../messageQueue/redisClient");
const {
    status
} = require("../constants/responseAndStatus");
const program = require("../constants/config");
const logger = require("../logger/log");
const jobController = require("../dbConnections/jobController");


const server = net.createServer();

function storeProcess(pid, port, rss, cpuUsage) {
    let process_details_store = process.pid;
    redisClient.sadd(program.PROCESS_STORE, pid);
    redisClient.hset(process_details_store, "pid", pid);
    redisClient.hset(process_details_store, "port", port);
    redisClient.hset(process_details_store, "rss", rss);
    redisClient.hset(process_details_store, "cpuUsage", cpuUsage);
    redisClient.hset(process_details_store, "jobCount", 0);
}

server.listen(program.PORT, () => {
    logger.info(`The process started with pid ${process.pid} in port ${program.PORT}`);
    storeProcess(process.pid, program.PORT, process.memoryUsage().rss, process.cpuUsage().system);
    redisSubClient.on("subscribe", (channel, count) => {
        logger.info("Subscribed to " + channel + ". Now subscribed to " + count + " channel(s).");
    });

    function checkProcessesToAssignJob(processLists) {
        let maxAssignedJob = 0,
            minRssCpuAvg = 0;
        for (let index = 0; index < processLists.length; index++) {
            if (maxAssignedJob < processLists[index].jobCount) {
                maxAssignedJob = processLists[index].jobCount;
            }
            if (minRssCpuAvg > (processLists[index].rss + processLists[index].cpuUsage) / 2) {
                minRssCpuAvg = (processLists[index].rss + processLists[index].cpuUsage) / 2;
            }
        }
        redisClient.hget(process.pid, "jobCount", (err, count) => {
            if (err) {
                logger.error(err);
            }
            if (count < maxAssignedJob) {
                processingJobs();
            } else if (minRssCpuAvg < (process.memoryUsage().rss + process.cpuUsage().system) / 2) {
                processingJobs();
            }
        });
    }

    function shouldJobBeProcessed() {
        redisClient.hget(process.pid, "jobCount", (err, obj) => {
            if (err) {
                logger.error(err);
            }
            let jobcount = parseInt(obj);
            if (jobcount === 0) {
                processingJobs();
            } else {
                redisClient.smembers(program.PROCESS_STORE, (err, processes) => {
                    if (err) {
                        logger.error(err);
                    }
                    let processList = [];
                    let processListDetails = {};
                    for (let i = 0; i < processes.length; i++) {
                        if (processes[i] !== process.pid) {
                            processList.push(processes[i]);
                        }
                    }
                    async.each(processList, (process, cb) => {
                        redisClient.hgetall(process, (err, obj) => {
                            if (err) {
                                logger.error(err);
                            }
                            processListDetails[process] = obj;
                            cb();
                        });
                    }, (err) => {
                        if (err) {
                            logger.error(err);
                        }
                        checkProcessesToAssignJob(processListDetails);

                    });
                });
            }

        });
    }

    function processingJobs() {
        redisClient.spop(program.JOB_STORE, (err, jobId) => {
            jobController.getJob(jobId)
                .then((result) => {
                    if (result.status === status.success) {
                        let jobDetails = result.data;
                        redisClient.sadd(program.JOB_PROCESSED, jobId);
                        try {
                            logger.info("Running job...");
                            vm.runInThisContext(jobDetails.script, {
                                timeout: jobDetails.frequency
                            });
                            if (jobDetails.repeat) {
                                redisClient.sadd(program.JOB_STORE, jobId);
                            }
                            redisClient.srem(program.JOB_PROCESSED, jobId);
                            redisClient.hget(process.pid, "jobCount", (err, count) => {
                                if (err) {
                                    logger.error(err);
                                }
                                redisClient.hset(process.pid, "jobCount", count++);
                            });
                        } catch (err) {
                            logger.error(`Failed to execute the script ${err}`);
                        }
                    }
                });
        });

    }

    redisSubClient.on("message", (channel, message) => {
        logger.info(`Message from channel ${channel} : ${message}`);
        redisClient.smembers(program.JOB_PROCESSED, (err, arr) => {
            if (arr.length > 0) {
                for (let i = 0; i < arr.length; i++) {
                    redisClient.sadd(program.JOB_STORE, arr[i]);
                    redisClient.srem(program.JOB_PROCESSED, arr[i]);
                }
            }

            redisClient.scard(program.JOB_STORE, (err, count) => {
                if (count === 0) {
                    logger.info("There are no jobs to be processed");
                } else {
                    shouldJobBeProcessed();
                }
            });
        });
    });

    redisSubClient.subscribe(program.CHANNEL);
});

