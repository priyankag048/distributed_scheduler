const pool = require("./connection");
const logger = require("../logger/log");
const { status, responseText } = require("../constants/responseAndStatus");
let result = {};
let message = "";

class JobController {
    constructor(queryString){
        this.jobQuery = queryString;
    }

    getJob(id) {
        return (async () => {
            const client = await pool.connect();
            try {
                const sQuery = await client.query(this.jobQuery.get_row, [id]);
                if (sQuery.rowCount === 1) {
                    result.message = `${responseText.record_found} ${id}`;
                    result.data = sQuery.rows[0];
                    result.status = status.success;
                } else {
                    result.message = responseText.record_not_available;
                    result.data = null;
                    result.status = status.not_found;
                }
                return result;
            } finally {
                client.release();
            }
        })().catch(e => logger.error(e));
    }

    getAllJobs(){
        return (async () => {
            const client = await pool.connect();
            try {
                const sQuery = await client.query(this.jobQuery.get_all_rows);
                if (sQuery.rowCount === 1) {
                    result.message = `${responseText.records_found}`;
                    result.data = sQuery.rows;
                    result.status = status.success;
                } else {
                    result.message = responseText.record_not_available;
                    result.data = null;
                    result.status = status.not_found;
                }
                return result;
            } finally {
                client.release();
            }
        })().catch(e => logger.error(e));
    }

    createJob(name, description, frequency, script,repeat) {
        return (async () => {
            const client = await pool.connect();
            try {
                let id;
                const sQuery = await client.query(this.jobQuery.get_c_row, [name]);
                if (sQuery.rowCount === 0) {
                    let startTimeStamp = new Date();
                    let startdate = `${startTimeStamp.getDate()}-${startTimeStamp.getMonth()}-${startTimeStamp.getFullYear()}  ${startTimeStamp.getHours()}:${startTimeStamp.getMinutes()}:${startTimeStamp.getSeconds()}`;
                    const cQuery = await client.query(this.jobQuery.create_row, [name, description, frequency, startdate, script,repeat]);
                    id = cQuery.rows[0].id;
                    result.message = `${responseText.record_created} ${id}`;
                    result.locationHeader = `/scheduler/jobs/${id}`;
                    result.status = status.created;
                    return result;
                } else {
                    result.message = responseText.record_exists;
                    result.data = null;
                    result.status = status.not_able_to_process;
                    return result;
                }
            } finally {
                client.release();
            }
        })().catch(e => logger.error(e));
    }
}

module.exports = JobController;