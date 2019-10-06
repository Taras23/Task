const cookieParser = require('cookie-parser');
const session = require('express-session');

const mysql = require('mysql');
const MySQLStore = require('express-mysql-session')(session);

module.exports = {
    createStore: function(choice) {
        var config = {
            host:'localhost',
            user: 'root',
            password: '1secret2my',
            database: 'MessengerDb',
            port: 3306,
            // pool:{
                 connectionLimit : 10, //максимально допустимо количество соединений пула
                 connectTimeout: 30000 //время ожидания перед завершением неиспользуемого соединения
            //}
        }
        if (choice == "store") { return new  MySQLStore(config);}
        else if(choice == "pool") {return mysql.createPool(config);}
        else if(choice == "connection") {return mysql.createConnection(config);}
    }

    
    
}