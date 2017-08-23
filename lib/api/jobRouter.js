const express = require('express');
const router = express.Router();

const jobController = require('../dbConnections/jobController');
const logger = require('../logger/log');

router.post('/create', (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            "error": "Bad Request"
        });
    } else {
        jobController.createJob(req.body.id, req.body.description, req.body.frequency, req.body.script)
            .then(result => {
                if (result.data !== null) {
                    res.location = result.data;
                    if (result.status === 201) {
                        logger.info(result.message);
                        res.status(result.status).json({
                            "info": result.message
                        });
                    }
                } else {
                    logger.info(result.message);
                    res.status(result.status).json({
                        "info": result.message
                    });
                }
            })
    }
});



module.exports = router;