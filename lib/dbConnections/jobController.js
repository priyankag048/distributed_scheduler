const {getConnection,Promise} = require("./connection");
const { Job } = require("../constants/queryString");
const logger = require("../logger/log");
let response = {};
let message = "";

class JobController {
    createJob(id, description, frequency, script) {
        Promise.using(getConnection(), (connection) => {
            return connection.queryAsync(Job.GetRow, [id])
                .then(result => {
                    if (result.rowCount === 0) {
                        let startTimeStamp = new Date();
                        let startdate = `${startTimeStamp.getDate()}-${startTimeStamp.getMonth()}-${startTimeStamp.getFullYear()}
                                          ${startTimeStamp.getHours()}:${startTimeStamp.getMinutes()}:${startTimeStamp.getSeconds()}`;
                        return connection.queryAsync(Job.CreateRow, [id, description, frequency, startdate, script])
                            .then(() => {
                                message = `Inserted successfully with id ${id}`;
                                response.message = message;
                                response.data = id;
                                response.status = 201;
                                return response;
                            })
                            .catch((err) => {
                                logger.error(err);
                            });
                    } else {
                        message = "Already exists";
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