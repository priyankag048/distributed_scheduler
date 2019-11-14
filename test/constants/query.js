const pool = require("../../lib/dbConnections/connection");
function query(queryText, queryValues, cb){
    pool.connect((err, client, release)=>{
        if(err){
            return cb(err);
        }

        client.query(queryText, queryValues, (err, result)=>{
            release();

            if(err){
                return cb(err);
            }
            return cb(null, result.rows, result);
        });
    });
}

module.exports = query;