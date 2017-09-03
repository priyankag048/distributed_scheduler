const express = require("express");
const jobController = require("../dbConnections/jobController");
const { status, responseText } = require("../constants/responseAndStatus");
const logger = require("../logger/log");
const program = require("../constants/config");
const redisClient = require("../messageQueue/redisClient");

const router = express.Router();

router.get("/job/:id", (req, res) => {
    if (!req.params.id) {
        return res.status(status.bad_request).json({
            "error": responseText.bad_request
        });
    } else {
        jobController.getJob(req.params.id)
            .then(result => {
                logger.info(result.message);
                res.status(result.status);
                if (result.data !== null) {
                    res.json({
                        "data": result.data
                    });
                } else {
                    res.json({
                        "info": result.message
                    });
                }
            });
    }
});

router.post("/jobs", (req, res) => {
    if (!req.body) {
        return res.status(status.bad_request).json({
            "error": responseText.bad_request
        });
    } else {
        jobController.createJob(req.body.name, req.body.description, req.body.frequency, req.body.script,req.body.repeat)
            .then(result => {
                if (result.data !== null) {
                    let jobId = result.locationHeader.split("/").reverse()[0];
                    redisClient.publish(program.CHANNEL, jobId);
                    redisClient.sadd(program.JOB_STORE, jobId);
                    res.set("Location", result.locationHeader);
                }
                logger.info(result.message);
                res.status(result.status).json({
                    "info": result.message
                });
            });
    }
});

router.put("/job/:id", (req, res) => {
    if (!req.params.id && !req.body) {
        return res.status(status.bad_request).json({
            "error": responseText.bad_request
        });
    } else {
        jobController.modifyJob(req.params.id, req.body.description, req.body.frequency, req.body.script)
            .then(result => {
                logger.info(result.message);
                res.status(result.status).json({
                    "info": result.message
                });
            });
    }
});

router.delete("/job/:id", (req, res) => {
    if (!req.params.id) {
        return res.status(status.bad_request).json({
            "error": responseText.bad_request
        });
    } else {
        jobController.deleteJob(req.params.id)
            .then(result => {
                logger.info(result.message);
                res.status(result.status).json({
                    "info": result.message
                });

            });
    }
});

module.exports = router;