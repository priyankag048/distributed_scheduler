const pool = require("./connection");
const { JobQuery } = require("../constants/queryString");
const logger = require("../logger/log");
const { Status, ResponseText } = require("../constants/responseAndStatus");
let response = {};
let message = "";

class JobController {

    getJob(id) {
        return (async () => {
            const client = await pool.connect();
            try {
                const sQuery = await client.query(JobQuery.GetRow, [id]);
                if (sQuery.rowCount === 1) {
                    response.message = ResponseText.Record_Found + " " + id;
                    response.data = sQuery.rows;
                    response.status = Status.success;
                } else {
                    response.message = ResponseText.Record_Not_Available;
                    response.status = Status.not_found;
                }
                return response;
            } finally {
                client.release();
            }
        })().catch(e => logger.error(e));
    }

    createJob(id, description, frequency, script) {
        return (async () => {
            const client = await pool.connect();
            try {
                const sQuery = await client.query(JobQuery.GetRow, [id]);
                if (sQuery.rowCount === 0) {
                    let startTimeStamp = new Date();
                    let startdate = `${startTimeStamp.getDate()}-${startTimeStamp.getMonth()}-${startTimeStamp.getFullYear()}
                                            ${startTimeStamp.getHours()}:${startTimeStamp.getMinutes()}:${startTimeStamp.getSeconds()}`;
                    const cQuery = await client.query(JobQuery.CreateRow, [id, description, frequency, startdate, script])
                    response.message = ResponseText.Record_Created + " " + id;
                    response.data = id;
                    response.status = Status.created;
                    return response;
                } else {
                    response.message = ResponseText.Record_Exists;
                    response.data = null;
                    response.status = Status.not_able_to_process;
                    return response;
                }
            } finally {
                client.release();
            }
        })().catch(e => logger.error(e));
    }


    modifyJob(id, description, frequency, script) {
        return (async () => {
            const client = await pool.connect();
            try {
                const sQuery = await client.query(JobQuery.GetRow, [id]);
                if (sQuery.rowCount === 1) {
                    const mQuery = await client.query(JobQuery.ModifyRow, [description, frequency, script, id])
                    response.message = ResponseText.Record_Modified;
                    response.data = mQuery.rows;
                    response.status = Status.success;
                    return response;
                } else {
                    response.message = ResponseText.Record_Not_Available;
                    response.data = null;
                    response.status = Status.not_able_to_process;
                    return response;
                }
            } finally {
                client.release();
            }
        })().catch(e => logger.error(e));
    }

    deleteJob(id) {
        return (async () => {
            const client = await pool.connect();
            try {
                const sQuery = await client.query(JobQuery.GetRow, [id]);
                if (sQuery.rowCount === 1) {
                    const dQuery = await client.query(JobQuery.DeleteRow, [id])
                    response.message = ResponseText.Record_Deleted;
                    response.data = id;
                    response.status = Status.success;
                    return response;
                } else {
                    response.message = ResponseText.Record_Not_Available;
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