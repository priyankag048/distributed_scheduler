/**
 * query strings for job table
 */

const GetRow = "select * from job where id =($1)";
const CreateRow = "insert into job(id, description,frequency,startdate,script) values($1,$2,$3,$4,$5)";
const ModifyRow = "update job set description=($1),frequency=($2),script=($3) where id = ($4)";
const DeleteRow = "delete from job where id=($1)";

exports.Job = {
    GetRow : GetRow,
    CreateRow : CreateRow,
    ModifyRow : ModifyRow,
    DeleteRow : DeleteRow
};