const express = require("express");
const router = express.Router();

const jobController = require("../dbConnections/jobController");
const { Status } = require("../constants/responseAndStatus");
const logger = require("../logger/log");

router.post("/create", (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            "error": "Bad Request"
        });
    } else {
        jobController.createJob(req.body.id, req.body.description, req.body.frequency, req.body.script)
            .then(response => {
                if (response.data !== null) {
                    res.location = response.data;
                    if (response.status === Status.created) {
                        logger.info(response.message);
                        res.status(response.status).json({
                            "info": response.message
                        });
                    }
                } else {
                    logger.info(response.message);
                    res.status(response.status).json({
                        "info": response.message
                    });
                }
            });
    }
});



module.exports = router;