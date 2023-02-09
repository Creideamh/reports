const mysql = require('mysql2');


const options = mysql.createConnection({
    host:'127.0.0.1',
    port: 3306,
    user: 'root',
    database: 'reports'
});

module.exports = options;
