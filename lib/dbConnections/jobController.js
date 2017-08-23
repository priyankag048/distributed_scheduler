const { getConnection, Promise} = require("./connection");
const { JobQuery } = require("../constants/queryString");
const logger = require("../logger/log");
const {Status, ResponseText} = require("../constants/responseAndStatus");
let response = {};
let message = "";

class JobController {
    createJob(id, description, frequency, script) {
        Promise.using(getConnection(), (connection) => {
            return connection.queryAsync(JobQuery.GetRow, [id])
                .then(result => {
                    if (result.rowCount === 0) {
                        let startTimeStamp = new Date();
                        let startdate = `${startTimeStamp.getDate()}-${startTimeStamp.getMonth()}-${startTimeStamp.getFullYear()}
                                          ${startTimeStamp.getHours()}:${startTimeStamp.getMinutes()}:${startTimeStamp.getSeconds()}`;
                        return connection.queryAsync(JobQuery.CreateRow, [id, description, frequency, startdate, script])
                            .then(() => {
                                message = ResponseText.Successfully_Created + " " + id;
                                logger.info(message);
                                response.message = message;
                                response.data = id;
                                response.status = Status.created;
                                return response;
                            })
                            .catch((err) => {
                                logger.error(err);
                            });
                    } else {
                        message = ResponseText.Record_Exists;
                        logger.info(message);
                        response.message = message;
                        response.data = null;
                        response.status = 422;
                        return response;
                    }
                })
                .catch((err) => {
                    logger.error(err);
                });
        });
    }
}

module.exports = new JobController();