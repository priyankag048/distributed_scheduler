const express = require("express");
const bodyParser = require("body-parser");
const logger = require("./logger/log");
const app = express();

const jobRouter  = require("./api/jobRouter");
const program = require("./constants/config");

/**
 * Request body parsing middleware
 */
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

/**
 * Routing middleware
 */
app.use("/scheduler", jobRouter);

app.listen(program.PORT,()=>{
    logger.info(`application listening to ${program.PORT}`);
});

module.exports = app;