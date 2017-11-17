const JobQuery = {
    get_all_rows : "select * from job_test",
    get_row: "select * from job_test where id =($1)",
    create_row: "insert into job_test(name, description,frequency,startdate,script,repeat) values($1,$2,$3,$4,$5,$6) returning id",
    modify_row: "update job_test set description=($1),frequency=($2),script=($3) where id = ($4)",
    delete_row: "delete from job_test where id=($1)",
    get_c_row : "select * from job_test where name =($1)",
    delete_all_rows : "delete from job_test"
};


module.exports = JobQuery;