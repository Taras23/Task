const mysql = require("mysql");
const pool = require("./session_handler").createStore("pool");
const pass_handler = require("./password_handler");

module.exports = {
    curr_user: '',
    get_users: function (request,response){ 
        pool.getConnection(function(err){
            if(!err) {
                console.log('Node connected to mysql server get_users');
                 pool.query('Select * from login',function(err2,records){
                     if(!err2){
                         var users = records.map((row)=>{
                             return `<h3>  ${row.Login} : ${row.Password} </h3>`  
                         }); 
                         response.send(users.join(''));
                     }
                 }) 
            
             }  
         })
    },
    check_users: function (request,response,next){
        var self = this;
        pool.getConnection(function(err){
            if(!err) {
                console.log('Node connected to mysql server check_users');
                var sql = "SELECT * FROM ?? WHERE ?? = ?";
                var inserts = ['login', 'Login', request.body.login];
                 sql = mysql.format(sql, inserts);

                 pool.query(sql,function(err2,records){
                     if(!err2){ console.log("records" + records);
                       if (records.length > 0){
                        self.curr_user = records[0].Login;
                        next(); //передаем управление следующему обработчику
                       } else {
                           console.log("User not found");
                           response.status(404).send('User not found!');
                       }
                     }
                 }) 
             }  
         })
    },
    check_pass: function(request,response,next){
        var self = this;
        pool.getConnection(function(err){
            console.log('Node connected to mysql server check_pass');
            if(!err) {
                var sql = "SELECT * FROM ?? WHERE ?? = ?";
                var inserts = ['login', 'Password',pass_handler.encrypt_pass(request.body.password)];
                sql = mysql.format(sql, inserts);

                 pool.query(sql,function(err2,records){
                     if(!err2){
                       if (records.length > 0){
                           request.session.login = curr_user;
                       response.status(200).send('User: ' + request.session.login);
                       console.log("Loged in !");
                        next();
                       } else {
                        console.log("Wrong password!");
                           response.status(404).send('Wrong password!');
                       }
                     }
                 }) 
             }  
         })
    }
}