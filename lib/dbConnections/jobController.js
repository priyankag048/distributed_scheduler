const client = require('./connection');
let message;
let response = {
    message: '',
    data: null,
    status: null
};

class JobController {

    /* get job */
    getJob(id) {
        client.connectAsync()
            .then(() => {
                return client.queryAsync('select * from job where id = ($1)', [id])
                    .then((result) => {
                        if (result.rowCount === 1) {
                            console.log("rows", result.rows);
                            response.message = "OK";
                            response.data = result.rows;
                            response.status = 200;
                        } else {
                            message = "No such job exists";
                            console.log(message);
                            response.message = message;
                            response.status = 404;
                        }
                        return response;
                    })
                    .catch((err) => {
                        console.error(err);
                    })
                    .finally(() => {
                        client.end();
                    });
            });
    }

    /* create new job */

    createJob(id, description, frequency, script) {
        return client.connectAsync()
            .then(() => {
                return client.queryAsync('select * from job where id = ($1)', [id])
                    .then((result) => {
                        if (result.rowCount === 0) {
                            let startTimeStamp = new Date();
                            let startdate = `${startTimeStamp.getDate()}-${startTimeStamp.getMonth()}-${startTimeStamp.getFullYear()}
                                          ${startTimeStamp.getHours()}:${startTimeStamp.getMinutes()}:${startTimeStamp.getSeconds()}`
                            return client.queryAsync('insert into job(id, description,frequency,startdate,script) values($1,$2,$3,$4,$5)', [id, description, frequency, startdate, script])
                                .then((result) => {
                                    console.log(result);
                                    message = `Inserted successfully with id ${id}`;
                                    response.message = message;
                                    response.data = id;
                                    response.status = 201;
                                    return response;
                                })
                                .catch((err) => {
                                    console.error(err);
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
                        console.error(err);
                    })
                    .finally(() => {
                        client.end()
                    })
            });
    }

    /* modify an existing job */

    modifyJob(id, description, frequency, script) {
       return client.connectAsync()
            .then(() => {
                return client.queryAsync('select * from job where id =($1)', [id])
                    .then((result) => {
                        if (result.rowCount === 1) {
                            return client.queryAsync(`update job set description=($1),frequency=($2),script=($3)
                                                       where id = ($4)`, [description, frequency, script, id])
                                .then((result) => {
                                    console.log(result);
                                    message = `${id} is updated successfully`;
                                    response.message = message;
                                    response.data = id;
                                    response.status = 200;
                                    return response;
                                })
                                .catch((err) => {
                                    console.error(err);
                                });

                        } else {
                            message = "No such job exists to update";
                            response.message = message;
                            response.data = null;
                            response.status = 404;
                            return response;
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    })
                    .finally(() => {
                        client.end()
                    })
            })
    }


    /*delete an existing job when not in use */

    deleteJob(id) {
       return client.connectAsync()
            .then(() => {
                return client.queryAsync('select * from job where id = ($1)', [id])
                    .then((result) => {
                        if (result.rowCount === 1) {
                            return client.queryAsync('delete from job where id=($1)', [id])
                                .then((result) => {
                                    console.log(result);
                                    message = `${id} job is successfully deleted`;
                                    response.message = message;
                                    response.data = id;
                                    response.status = 200;
                                    return response;
                                })
                                .catch((err) => {
                                    console.error(err);
                                });

                        } else {
                            message = "No such job exists to be deleted";
                            response.message = message;
                            response.data = null;
                            response.status = 404;
                            return response;
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    })
                    .finally(() => {
                        client.end()
                    })
            })
    }
}

module.exports = new JobController();