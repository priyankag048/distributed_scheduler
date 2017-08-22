const express = require('express');
const router = express.Router();


const jobController = require('../dbConnections/jobController');
const config = require('../constants/config');

// router.get('/:id',(req,res)=>{

// });

router.post('/create', (req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    } else {
        jobController.createJob(req.body.id, req.body.description, req.body.frequency, req.body.script)
            .then((result) => {
                console.log("Response", result);
                if (res.data !== null) {
                    res.location = result.data;
                }
                res.status(result.status).send(result.message);

            })
    }
});



// router.put('/modify',(req,res)=>{

// });

// router.delete('/delete',(req,res)=>{

// })


module.exports = router;