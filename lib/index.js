const express = require("express");
const bodyParser = require("body-parser");
const logger = require("./logger/log");
const app = express();

const jobRouter  = require("./api/jobRouter");

const port = process.env.PORT || 3000;
/**
 * Request body parsing middleware
 */
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

/**
 * Routing middleware
 */
app.use("/scheduler", jobRouter);

app.listen(port,()=>{
    logger.info(`application listening to ${port}`);
});

module.exports = app;