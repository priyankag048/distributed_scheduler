const pg = require("pg");

const program = require("../constants/config");

const pool = new pg.Pool({
  user: program.PGUSER,
  password: program.PGPASSWORD,
  host: program.PGHOST,
  port: program.PGPORT,
  database: program.PGDATABASE
});

module.exports = pool;