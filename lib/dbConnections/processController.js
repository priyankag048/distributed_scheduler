const client = require("./connection");
const logger = require("../logger/log");
var message;
var response = {};
class ProcessController {

    createProcess(pid, port, rss, cpuUsage) {
        return client.connectAsync()
            .then(() => {
                let rss_to_cpu = parseInt(rss / cpuUsage);
                return client.queryAsync("insert into process(id,port,rss,cpu_utilization,rss_to_cpu,assigned_jobs_count) values($1,$2,$3,$4,$5,$6)", [pid, port, rss, cpuUsage, rss_to_cpu, 0])
                    .then(() => {
                        message = `process created with id ${pid} running in port ${port}`;
                        response.message = message;
                        response.pid = pid;
                        response.port = port;
                        return response;
                    })
                    .catch((err) => {
                        logger.error(err);
                    });
            })
            .finally(() => {
                client.end();
            });
    }

    deleteProcess(pid) {
        return client.connectAsync()
            .then(() => {
                return client.queryAsync("select * from process where id=($1)", [pid])
                    .then((result) => {
                        if (result.rowCount === 1) {
                            return client.queryAsync("delete from process where id=($1)", [pid])
                                .then(() => {
                                    response.message = `process with id ${pid} is successfully deleted`;
                                    return response;
                                });
                        }
                    })
                    .catch((err) => {
                        logger.error(err);
                    });
            })
            .catch((err) => {
                logger.error(err);
            })
            .finally(() => {
                client.end();
            });

    }
}

module.exports = new ProcessController();