const pool = require("./connection");
const { ProcessQuery } = require("../constants/queryString");
const logger = require("../logger/log");
const { Status, ResponseText } = require("../constants/responseAndStatus");
let response = null;

class ProcessController {

    createProcess(pid, port, rss, cpuUsage) {
        return (async () => {
            const client = await pool.connect();
            try{
                const sQuery = await client.query(ProcessQuery.get_row,[pid]);
                if(sQuery.rowCount === 0){
                   let rssToCpu = parseInt(rss/cpuUsage);
                   const cQuery = await client.query(ProcessQuery.create_row,[pid,port,rss,cpuUsage,rssToCpu,0]);
                   response = `${ResponseText.record_created} ${pid}`;
                   return response;
                }else{
                    response = ResponseText.record_exists;
                    return response;
                }
            }
            finally{
                client.release();
            }
        })().catch(e=> logger.error(e));
    }
}

module.exports = new ProcessController();