const pg = require("pg");
const Promise = require("bluebird");

const program = require("../constants/dbConfig");

Promise.promisifyAll(pg.Pool.prototype);
Promise.promisifyAll(pg.Pool, {context: pg.Pool});
Promise.promisifyAll(pg.Connection.prototype);
Promise.promisifyAll(pg.Connection);
Promise.promisifyAll(pg.Query.prototype);
Promise.promisifyAll(pg.Query);
Promise.promisifyAll(pg, {
    context: pg
});

const pool = new pg.Pool({
  user: program.PGUSER,
  password: program.PGPASSWORD,
  host: program.PGHOST,
  port: program.PGPORT,
  database: program.PGDATABASE
});

module.exports = pool;