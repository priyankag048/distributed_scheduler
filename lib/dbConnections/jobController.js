const pool = require("./connection");
const { JobQuery } = require("../constants/queryString");
const logger = require("../logger/log");
const { Status, ResponseText } = require("../constants/responseAndStatus");
let response = {};
let message = "";

class JobController {
    createJob(id, description, frequency, script) {
        return (async() => {
            const client = await pool.connect()
            try {
                const sQuery = await client.query(JobQuery.GetRow, [id]);
                if (sQuery.rowCount === 0) {
                    let startTimeStamp = new Date();
                    let startdate = `${startTimeStamp.getDate()}-${startTimeStamp.getMonth()}-${startTimeStamp.getFullYear()}
                                            ${startTimeStamp.getHours()}:${startTimeStamp.getMinutes()}:${startTimeStamp.getSeconds()}`;
                    const cQuery = await client.query(JobQuery.CreateRow, [id, description, frequency, startdate, script])
                    message = ResponseText.Successfully_Created + " " + id;
                    response.message = message;
                    response.data = id;
                    response.status = Status.created;
                    return response;
                } else {
                    message = ResponseText.Record_Exists;
                    response.message = message;
                    response.data = null;
                    response.status = Status.not_able_to_process;
                    return response;
                }
            } finally {
                client.release();
            }
        })().catch(e => logger.error(e));
    }
}

module.exports = new JobController();