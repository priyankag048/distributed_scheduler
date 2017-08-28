const pg = require("pg");

const { Program } = require("../constants/config");

const pool = new pg.Pool({
  user: Program.PGUSER,
  password: Program.PGPASSWORD,
  host: Program.PGHOST,
  port: Program.PGPORT,
  database: Program.PGDATABASE
});

module.exports = pool;