'use strict'

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chat-database'
});

connection.connect((err) => {
    if(err){
        console.error('Cannot connect to MySQL database');
        process.exit(0);
        return;
    }
});

module.exports = connection;