const mysql = require('mysql');
const pool = require("./session_handler").createStore("pool");
var pass_handler = require("./password_handler"); 
module.exports = {
addUser: function(request,response){
    pool.getConnection(function(err){
        if(!err) {
            console.log('Node connected to mysql server addUser');
            var sql = "INSERT INTO login(Login,Password) VALUES (?,?)";
            var inserts = [request.body.login, pass_handler.encrypt_pass(request.body.password)];
             sql = mysql.format(sql, inserts);

             pool.query(sql,function(err2,records){
                 if(!err2){ console.log("created");
                  response.status(200).send('User created successfully!');
                   } else {
                       console.log("User not found");
                       response.status(404).send('User not found!');
                   }
                 }
             ) 
         } 
        }
    )
}
}