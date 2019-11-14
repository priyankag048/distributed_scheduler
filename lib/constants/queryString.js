/**
 * query strings for job table
 */

const JobQuery = {
    get_all_rows : "select * from job",
    get_row: "select * from job where id =($1)",
    create_row: "insert into job(name, description,frequency,startdate,script,repeat) values($1,$2,$3,$4,$5,$6) returning id",
    modify_row: "update job set description=($1),frequency=($2),script=($3) where id = ($4)",
    delete_row: "delete from job where id=($1)",
    get_c_row : "select * from job where name =($1)"
};


module.exports = JobQuery;