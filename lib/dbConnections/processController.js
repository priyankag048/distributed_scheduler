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
                const sQuery = await client.query(ProcessQuery.GetRow,[pid]);
                if(sQuery.rowCount === 0){
                   let rssToCpu = parseInt(rss/cpuUsage);
                   const cQuery = await client.query(ProcessQuery.CreateRow,[pid,port,rss,cpuUsage,rssToCpu,0]);
                   response = ResponseText.Record_Created+" "+pid;
                   return response;
                }else{
                    response = ResponseText.Record_Exists;
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