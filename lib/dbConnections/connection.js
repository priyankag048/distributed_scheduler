const pg = require("pg");
const Pool = require("pg-pool");
const Promise = require("bluebird");

const program = require("../constants/dbConfig");

Promise.promisifyAll(pg.Client.prototype);
Promise.promisifyAll(pg.Client);
Promise.promisifyAll(pg.Connection.prototype);
Promise.promisifyAll(pg.Connection);
Promise.promisifyAll(pg.Query.prototype);
Promise.promisifyAll(pg.Query);
Promise.promisifyAll(pg, {
    context: pg
});

const client = new pg.Client();
const pool = new Pool({Client:client});


let connectionString = `postgres://${program.PGUSER}:${program.PGPASSWORD}@${program.PGHOST}:${program.PGPASSWORD}/${program.PGDATABASE}`;

function getConnection(){
    let close = null;
     return pool.connectAsync(connectionString)
        .spread((client,done)=>{
            close = done;
            return client;
        }).disposer(()=>{
            if(close !== null){
                close();
            }
        });
}

exports.Promise = Promise;
exports.getConnection = getConnection;

module.exports = exports;