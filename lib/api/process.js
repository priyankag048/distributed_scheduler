const processController = require('../dbConnections/processController');
const net = require('net');
const server = net.createServer();


server.listen(process.env.PORT, () => {
    console.log(`The process started with pid ${process.pid} in port ${P1}`);
    console.log(processController.createProcess);
    processController.createProcess(process.pid,P1,process.memoryUsage().rss,process.cpuUsage().system)
    .then((result)=>{
        console.log(result.message);
    })
    .catch((err)=>{
        console.error(err);
    })
});
