const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const jobRouter  = require('./api/jobRouter');

const port = process.env.PORT || 3000;
/**
 * Request body parsing middleware
 */
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

/**
 * Routing middleware
 */
app.use('/scheduler', jobRouter);

app.listen(port,()=>{
    console.log(`application listening to ${port}`);
});