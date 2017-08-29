const pool = require("./connection");
const { JobQuery } = require("../constants/queryString");
const logger = require("../logger/log");
const { status, responseText } = require("../constants/responseAndStatus");
let response = {};
let message = "";

class JobController {

    getJob(id) {
        return (async () => {
            const client = await pool.connect();
            try {
                const sQuery = await client.query(JobQuery.get_row, [id]);
                if (sQuery.rowCount === 1) {
                    response.message = `${responseText.record_found}  ${id}`;
                    response.data = sQuery.rows[0];
                    response.status = status.success;
                } else {
                    response.message = responseText.record_not_available;
                    response.data = null;
                    response.status = status.not_found;
                }
                return response;
            } finally {
                client.release();
            }
        })().catch(e => logger.error(e));
    }

    createJob(name, description, frequency, script) {
        return (async () => {
            const client = await pool.connect();
            try {
                let id;
                const sQuery = await client.query(JobQuery.get_c_row, [name]);
                if (sQuery.rowCount === 0) {
                    let startTimeStamp = new Date();
                    let startdate = `${startTimeStamp.getDate()}-${startTimeStamp.getMonth()}-${startTimeStamp.getFullYear()}  ${startTimeStamp.getHours()}:${startTimeStamp.getMinutes()}:${startTimeStamp.getSeconds()}`;
                    const cQuery = await client.query(JobQuery.create_row, [name, description, frequency, startdate, script])
                    id = cQuery.rows[0].id;
                    response.message = `${responseText.record_created}  ${id}`;
                    response.locationHeader = `/scheduler/jobs/${id}`;
                    response.status = status.created;
                    console.log(response);
                    return response;
                } else {
                    response.message = responseText.record_exists;
                    response.data = null;
                    response.status = status.not_able_to_process;
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
                const sQuery = await client.query(JobQuery.get_row, [id]);
                if (sQuery.rowCount === 1) {
                    const mQuery = await client.query(JobQuery.modify_row, [description, frequency, script, id])
                    response.message = responseText.record_modified;
                    response.data = mQuery.rows[0];
                    response.status = status.success;
                    return response;
                } else {
                    response.message = responseText.record_not_available;
                    response.data = null;
                    response.status = status.not_able_to_process;
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
                const sQuery = await client.query(JobQuery.get_row, [id]);
                if (sQuery.rowCount === 1) {
                    const dQuery = await client.query(JobQuery.delete_row, [id])
                    response.message = responseText.record_deleted;
                    response.data = id;
                    response.status = status.success;
                    return response;
                } else {
                    response.message = responseText.record_not_available;
                    response.data = null;
                    response.status = status.not_able_to_process;
                    return response;
                }
            } finally {
                client.release();
            }
        })().catch(e => logger.error(e));
    }
}

module.exports = new JobController();