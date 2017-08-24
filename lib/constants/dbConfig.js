const program = require("commander");

program
.version("0.1.0")
.usage("test")
.option("-h, --PGHOST [type]","dbHost","127.0.0.1")
.option("-p, --PGPORT [type]","dbPort","5432")
.option("-u, --PGUSER [type]","dbUser","postgres")
.option("-P, --PGPASSWORD [type]","dbPassword","admin")
.option("-d, --PGDATABASE [type]","dbName","postgres")
.parse(process.argv);

module.exports = program;

