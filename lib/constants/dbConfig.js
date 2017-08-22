const dbHost = process.env.PGHOST || '127.0.0.1';
const dbPort = process.env.PGPORT || 5432;
const dbUser = process.env.PGUSER || 'postgres';
const dbPassword = process.env.PGPASSWORD || 'Piyali-1987';
const dbName = process.env.PGDATABASE || 'postgres';


module.exports =  {
    dbHost:dbHost,
    dbPort:dbPort,
    dbUser:dbUser,
    dbPassword:dbPassword,
    dbName:dbName
};