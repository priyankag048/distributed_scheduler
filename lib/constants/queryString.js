/**
 * query strings for job table
 */

const JobQuery = {
    get_row: "select * from job where id =($1)",
    create_row: "insert into job(name, description,frequency,startdate,script) values($1,$2,$3,$4,$5) returning id",
    modify_row: "update job set description=($1),frequency=($2),script=($3) where id = ($4)",
    delete_row: "delete from job where id=($1)",
    get_c_row : "select * from job where name =($1)"
};


/**
 * query strings for process table
 */

const ProcessQuery = {
    get_row : "select * from process where id =($1)",
    create_row : "insert into process(id, port,rss,cpu_utilization,rss_to_cpu,assigned_jobs_count) values($1,$2,$3,$4,$5,$6)",
    modify_row : "update process set assigned_jobs_count=($1) where id = ($2)",
    delete_row : "delete from process where id=($1)",
};


exports.JobQuery = JobQuery;
exports.ProcessQuery = ProcessQuery;
module.exports = exports;