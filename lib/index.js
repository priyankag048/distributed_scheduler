const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const config = require('./constants/config');
const jobRouter  = require('./api/jobRouter');

/**
 * Request body parsing middleware
 */
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

/**
 * Routing middleware
 */
app.use('/scheduler', jobRouter);

app.listen(config.port,()=>{
    console.log(`application listening to ${config.port}`);
});