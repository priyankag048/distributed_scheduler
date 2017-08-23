/**
 * query strings for job table
 */

const JobQuery = {
    GetRow: "select * from job where id =($1)",
    CreateRow: "insert into job(id, description,frequency,startdate,script) values($1,$2,$3,$4,$5)",
    ModifyRow: "update job set description=($1),frequency=($2),script=($3) where id = ($4)",
    DeleteRow: "delete from job where id=($1)",
};


/**
 * query strings for process table
 */

const ProcessQuery = {
    GetRow : "select * from process where id =($1)",
    CreateRow : "insert into process(id, port,rss,cpu_utilization,rss_to_cpu,assigned_jobs_count) values($1,$2,$3,$4,$5,$6)",
    ModifyRow : "update process set assigned_jobs_count=($1) where id = ($2)",
    DeleteRow : "delete from process where id=($1)",
};


exports.JobQuery = JobQuery;
exports.ProcessQuery = ProcessQuery;
module.exports = exports;