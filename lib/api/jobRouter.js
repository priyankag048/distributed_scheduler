const express = require("express");
const router = express.Router();

const jobController = require("../dbConnections/jobController");
const {
    Status
} = require("../constants/responseAndStatus");
const logger = require("../logger/log");


router.get('/get', (req, res) => {
    if (!req.query.id) {
        return res.status(400).json({
            "error": "Bad Request"
        });
    } else {
        jobController.getJob(req.query.id)
            .then(response => {
                if (response.data !== null) {
                    res.set("Content-Type", "application/json");
                    res.status(response.status).json(response.data);
                }
            })
    }
})

router.post("/create", (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            "error": "Bad Request"
        });
    } else {
        jobController.createJob(req.body.id, req.body.description, req.body.frequency, req.body.script)
            .then(response => {
                if (response.data !== null) {
                    res.set("Location",response.locationHeader);
                }
                res.set("Content-Type", "application/json");
                logger.info(response.message);
                res.status(response.status).json({
                    "info": response.message
                });
            });
    }
});

router.delete("/delete", (req, res) => {
    console.log("delete", req.query.id);
    if (!req.query.id) {
        return res.status(400).json({
            "error": "Bad Request"
        });
    } else {
        jobController.deleteJob(req.query.id)
            .then(response => {
                res.set("Content-Type", "application/json");
                res.status(response.status).json({
                    info: response.message
                });

            })
    }
});

module.exports = router;