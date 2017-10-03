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
const jobprocess = require("./jobprocess");

const server = net.createServer();

/* The storeProcess is used to store process details
such as pid, port, rss, cpuUsage and number of jobs assigned
to the process hash set with key value as the pid.
A set is also defined to store all the processes */
function storeProcess(pid, port, rss, cpuUsage) {
    let process_details_store = process.pid;
    jobprocess.addToSet(program.PROCESS_STORE, pid);
    let processes = {
        "pid": pid,
        "port": port,
        "rss": rss,
        "cpuUsage": cpuUsage,
        "jobCount": 0
    };
    for (let key in processes) {
        jobprocess.addToHash(process_details_store, key, processes[key]);
    }
}

server.listen(program.PORT, () => {
    logger.info(`The process started with pid ${process.pid} in port ${program.PORT}`);
    storeProcess(process.pid, program.PORT, process.memoryUsage().rss, process.cpuUsage().system);

    /* redis subscribe client to subscribe on the jobs from the channel */
    redisSubClient.on("subscribe", (channel, count) => {
        logger.info("Subscribed to " + channel + ". Now subscribed to " + count + " channel(s).");
    });

    redisSubClient.on("message", (channel, message) => {
        logger.info(`Message from channel ${channel} : ${message}`);
        startProcessing();
    });

    redisSubClient.subscribe(program.CHANNEL);


    /** callback from  checkJobCount => if the process crashed or exit before completing
     * the job scheduling, add the processing job in job store queue
     */
    function jobcountCallback(err, arr) {
        if (arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
                jobprocess.addToSet(program.JOB_STORE, arr[i]);
                jobprocess.removeFromSet(program.JOB_PROCESSED, arr[i]);
            }
        }
        /** check if the there is any job in the job queue */
        jobprocess.getCount(program.JOB_STORE, countCallback);
    }

    function countCallback(err, count) {
        if (count > 0) {
            shouldJobBeScheduledInTheProcess();
        }
    }

    /** check if the job can be processed in this process */
    function shouldJobBeScheduledInTheProcess() {
        jobprocess.getHashMember(process.pid, "jobCount", jobProcessCallback);
    }

    function jobProcessCallback(err, obj) {
        if (err) {
            logger.error(err);
        }
        let jobcount = parseInt(obj);
        if (jobcount === 0) {
            /** if job count is zero, schedule the job in this process */
            processingJobs();
        } else {
            jobprocess.getMembers(program.PROCESS_STORE, getProcessList);
        }
    }

    function getProcessList(err, processes) {
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
        }, err => {
            if (err) {
                logger.error(err);
            }
            checkProcessesToAssignJob(processListDetails);
        });
    }

    function checkProcessesToAssignJob(processLists) {
        let maxAssignedJob = 0,
            minRssCpuAvg = 0;
        if (Object.keys(processLists).length > 0) {
            for (let keys in processLists) {
                if (maxAssignedJob < processLists[keys].jobCount) {
                    maxAssignedJob = processLists[keys].jobCount;
                }
                if (minRssCpuAvg === 0) {
                    minRssCpuAvg = (processLists[keys].rss + processLists[keys].cpuUsage) / 2;
                }
                if (minRssCpuAvg > (processLists[keys].rss + processLists[keys].cpuUsage) / 2) {
                    minRssCpuAvg = (processLists[keys].rss + processLists[keys].cpuUsage) / 2;
                }
            }
            redisClient.hget(process.pid, "jobCount", (err, count) => {
                if (err) {
                    logger.error(err);
                }
                if (count <= maxAssignedJob) {
                    processingJobs();
                } else if (minRssCpuAvg < (process.memoryUsage().rss + process.cpuUsage().system) / 2) {
                    processingJobs();
                }
            });
        }
    }

    function processingJobs() {
        jobprocess.popFromSet(program.JOB_STORE, processJobCallback);
    }

    function processJobCallback(err, jobId) {
        jobController.getJob(jobId)
            .then((result) => {
                if (result.status === status.success) {
                    let jobDetails = result.data;
                    redisClient.sadd(program.JOB_PROCESSED, jobDetails.id);
                    setTimeout(() => {
                        vm.runInThisContext(jobDetails.script);
                        redisClient.srem(program.JOB_PROCESSED, jobDetails.id);
                        redisClient.hget(process.pid, "jobCount", (err, count) => {
                            if (err) {
                                logger.error(err);
                            }
                            let newCount = parseInt(count) + 1;
                            redisClient.hset(process.pid, "jobCount", newCount);
                            if (jobDetails.repeat) {
                                redisClient.sadd(program.JOB_STORE, jobDetails.id);
                            }
                            startProcessing();
                        });
                    }, jobDetails.frequency * 1000);
                }
            });
    }

    function startProcessing(){
        /** if a process exits before completing processing the job schedule the job in another process */
        jobprocess.checkJobCount(program.JOB_PROCESSED, jobcountCallback);
    }
});