const vm = require("vm");
const async = require("async");
const { status } = require("../constants/responseAndStatus");
const { program } = require("../constants/config");
const logger = require("../logger/log");
const JobController = require("../dbConnections/jobController");
const queryString = require("../constants/queryString");
const JobProcess = require("./jobprocess");
const jobController = new JobController(queryString);

class ProcessController {

    constructor(redisClient){
        this.jobprocess = new JobProcess(redisClient);
    }
    /* The storeProcess is used to store process details
    such as pid, port, rss, cpuUsage and number of jobs assigned
    to the process hash set with key value as the pid.
    A set is also defined to store all the processes */
    storeProcess(pid, port, rss, cpuUsage) {
        let process_details_store = pid;
        this.jobprocess.addToSet(program.PROCESS_STORE, pid);
        let processes = {
            "pid": pid,
            "port": port,
            "rss": rss,
            "cpuUsage": cpuUsage,
            "jobCount": 0
        };
        for (let key in processes) {
            this.jobprocess.addToHash(process_details_store, key, processes[key]);
        }
    }

    /* start processing the job consumption */
    startProcessing() {
        /** if a process exits before completing processing the job schedule the job in another process */
        this.jobprocess.checkJobCount(program.JOB_PROCESSED, jobcountCallback.bind(this));
        /** callback from  checkJobCount => if the process crashed or exit before completing
         * the job scheduling, add the processing job in job store queue
         */
        function jobcountCallback(err, arr) {
            if (arr.length > 0) {
                for (let i = 0; i < arr.length; i++) {
                    this.jobprocess.addToSet(program.JOB_STORE, arr[i]);
                    this.jobprocess.removeFromSet(program.JOB_PROCESSED, arr[i]);
                }
            }
            /** check if the there is any job in the job queue */
            this.jobprocess.getCount(program.JOB_STORE, countCallback.bind(this));
        }

        function countCallback(err, count) {
            if (count > 0) {
                this.shouldJobBeScheduledInTheProcess();
            }
        }

    }

    /** check if the job can be processed in this process */
    shouldJobBeScheduledInTheProcess() {
        this.jobprocess.getHashMember(process.pid, "jobCount", jobProcessCallback.bind(this));

        function jobProcessCallback(err, obj) {
            if (err) {
                logger.error(err);
            }
            let jobcount = parseInt(obj);
            if (jobcount === 0) {
                /** if job count is zero, schedule the job in this process */
                this.processingJobs();
            } else {
                this.jobprocess.getMembers(program.PROCESS_STORE, getProcessList.bind(this));
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
                this.jobprocess.getAllHashMembers(process, (err, obj) => {
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
                this.checkProcessesToAssignJob(processListDetails);
            });
        }
    }


    /** check all the processes based on assigned jobs and rss-cpu average 
     * to decide which process will run the job
     */
    checkProcessesToAssignJob(processLists) {
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
            this.jobprocess.getHashMember(process.pid, "jobCount", (err, count) => {
                if (err) {
                    logger.error(err);
                }
                if (count <= maxAssignedJob) {
                    this.processingJobs();
                } else if (minRssCpuAvg < (process.memoryUsage().rss + process.cpuUsage().system) / 2) {
                    this.processingJobs();
                }
            });
        }
    }

    /* Once confirmed that the given process will execute the job script, pop the job out of the job queue */
    processingJobs() {
        this.jobprocess.popFromSet(program.JOB_STORE, processJobCallback.bind(this));

        /* check for the job in database and execute the job script using vm */
        function processJobCallback(err, jobId) {
            jobController.getJob(jobId)
                .then((result) => {
                    if (result.status === status.success) {
                        let jobDetails = result.data;
                        this.jobprocess.addToSet(program.JOB_PROCESSED, jobDetails.id);
                        setTimeout(() => {
                            vm.runInThisContext(jobDetails.script);
                            this.jobprocess.removeFromSet(program.JOB_PROCESSED, jobDetails.id);
                            this.jobprocess.getHashMember(process.pid, "jobCount", (err, count) => {
                                if (err) {
                                    logger.error(err);
                                }
                                let newCount = parseInt(count) + 1;
                                this.jobprocess.addToHash(process.pid, "jobCount", newCount);
                                if (jobDetails.repeat) {
                                    this.jobprocess.addToSet(program.JOB_STORE, jobDetails.id);
                                }
                                this.startProcessing();
                            });
                        }, jobDetails.frequency * 1000);
                    }
                });
        }
    }



}

module.exports = ProcessController;