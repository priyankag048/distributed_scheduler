const express = require("express");
const router = express.Router();

const jobController = require("../dbConnections/jobController");
const {  Status, ResponseText } = require("../constants/responseAndStatus");
const logger = require("../logger/log");
const { Sub, Pub } = require("../messageQueue/channel");
const { Channel } = require("../constants/config");

router.get('/job/:id', (req, res) => {
    if (!req.params.id) {
        return res.status(Status.bad_request).json({
            "error": ResponseText.bad_request
        });
    } else {
        jobController.getJob(req.params.id)
            .then(response => {
                logger.info(response.message);
                res.status(response.status)
                if(response.data !== null){
                    res.json({"data" : response.data});
                }else{
                    res.json({"info" : response.message});
                }
            });
    }
})

router.post("/jobs", (req, res) => {
    if (!req.body) {
         return res.status(Status.bad_request).json({
            "error": ResponseText.bad_request
        });
    } else {
        jobController.createJob(req.body.name, req.body.description, req.body.frequency, req.body.script)
            .then(response => {
                if (response.data !== null) {
                    res.set("Location", response.locationHeader);
                }
                logger.info(response.message);
                if(res.status === Status.created ){
                    Sub.on("subscribe",(channel,count)=>{
                        logger.info(channel);
                        Pub.publish(Channel,response.locationHeader);
                    });
                }
                res.status(response.status).json({
                    "info": response.message
                });
            });
    }
});

router.put("/job/:id", (req, res) => {
    if (!req.params.id && !req.body) {
        return res.status(Status.bad_request).json({
            "error": ResponseText.bad_request
        })
    } else {
        jobController.modifyJob(req.params.id, req.body.description, req.body.frequency, req.body.script)
            .then(response => {
                logger.info(response.message);
                res.status(response.status).json({
                    "info": response.message
                });
            })
    }
})

router.delete("/job/:id", (req, res) => {
    if (!req.params.id) {
        return res.status(Status.bad_request).json({
            "error": ResponseText.bad_request
        });
    } else {
        jobController.deleteJob(req.params.id)
            .then(response => {
                logger.info(response.message);
                res.status(response.status).json({
                    "info": response.message
                });

            })
    }
});

module.exports = router;