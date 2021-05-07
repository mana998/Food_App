require('dotenv').config();

const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : process.env.HOST,
    database : process.env.DATABASE,
    user     : process.env.USER,
    password : process.env.PASSWORD
})

connection.connect();

// should we write ddf of db here ?? a lot of code!!
/*if (process.argv.includes("--createdb")){
    connection.query("CREATE TABLE IF NOT EXISTS movies (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(70), height INT) ",  (error, result) => {
        if (error) {
            throw error;
        }
        console.log(result);
    })
}
*/

module.exports = {
    connection
}