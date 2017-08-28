const express = require("express");
const bodyParser = require("body-parser");
const logger = require("./logger/log");
const app = express();

const jobRouter  = require("./api/jobRouter");
const { Program } = require("./constants/config");

/**
 * Request body parsing middleware
 */
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

/**
 * Routing middleware
 */
app.use("/scheduler", jobRouter);

app.listen(Program.PORT,()=>{
    logger.info(`application listening to ${Program.PORT}`);
});

module.exports = app;