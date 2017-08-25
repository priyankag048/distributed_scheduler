const express = require("express");
const router = express.Router();

const jobController = require("../dbConnections/jobController");
const {
    Status
} = require("../constants/responseAndStatus");
const logger = require("../logger/log");


router.get('/job/:id', (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({
            "error": "Bad Request"
        });
    } else {
        jobController.getJob(req.params.id)
            .then(response => {
                logger.info(response.message);
                res.set("Content-Type", "application/json");
                res.status(response.status)
                if(response.data !== null){
                    res.json({data : response.data});
                }else{
                    res.json({info : response.message});
                }
            });
    }
})

router.post("/jobs", (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            "error": "Bad Request"
        });
    } else {
        jobController.createJob(req.body.name, req.body.description, req.body.frequency, req.body.script)
            .then(response => {
                if (response.data !== null) {
                    res.set("Location", response.locationHeader);
                }
                res.set("Content-Type", "application/json");
                logger.info(response.message);
                res.status(response.status).json({
                    "info": response.message
                });
            });
    }
});

router.put("/job/:id", (req, res) => {
    if (!req.params.id && !req.body) {
        return res.status(400).json({
            "error": "Bad Request"
        });
    } else {
        jobController.modifyJob(req.params.id, req.body.description, req.body.frequency, req.body.script)
            .then(response => {
                res.set("Content-Type", "application/json");
                logger.info(response.message);
                res.status(response.status).json({
                    "info": response.message
                });
            })
    }
})

router.delete("/job/:id", (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({
            "error": "Bad Request"
        });
    } else {
        jobController.deleteJob(req.params.id)
            .then(response => {
                res.set("Content-Type", "application/json");
                logger.info(response.message);
                res.status(response.status).json({
                    info: response.message
                });

            })
    }
});

module.exports = router;