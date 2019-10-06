const express = require('express');
const app = express(); 
const server = require('http').createServer(app);

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const session = require('express-session');

const mysql = require('mysql');
const MySQLStore = require('express-mysql-session')(session);
const io = require('socket.io').listen(server);

const path = require('path');
const htmlPath = path.join(__dirname,'../view/html');

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

 var sessionHendler = require('./js/session_handler');
 var store = sessionHendler.createStore("store");
 var handlers = require('./js/queries');
 var signUp = require('./js/signup');
 var chatting = require('./js/chatting')(io);

 let ejs = require('ejs');

 app.use(cookieParser());
 app.set('view engine','ejs');

app.use(session({
    store: store,
    resave: false,
    saveUninitialized: true,
    secret: "supersecret"
})
);

server.listen(port,()=>{console.log(` Server has been started on port: ${port}..`);});

app.get('/',function(request,response){
    response.sendFile(htmlPath + '/index.html');
});
app.get('/chat',function(request,response){
    response.sendFile(htmlPath + '/chat.html');
});
app.get('/auth',function(request,response){
    response.sendFile(htmlPath + '/authentication.html');
    
});
app.get('/reg',function(request,response){
    response.sendFile(htmlPath + '/registration.html');
    
});

app.get('/all' ,handlers.get_users);
app.post('/login', handlers.check_users);
app.post('/login', handlers.check_pass);

app.post('/signup',signUp.addUser);

app.get('/check',function(request,response){
    if(request.session.login){
        response.send(`User ${request.session.login} is logged in!`)
        console.log( request.session.login);
    } else{
        response.send('not logged in');
        console.log('not logged in');
    }
});
app.get("/logout",function(request,response){
    request.session.login = "";
    console.log("You are logged out");
    response.send("Bay Bay, you are logged out");
});
app.get("/admin",function(request,response) {
    if (request.session.login == "taras@gmail.com"){
        console.log(request.session.login + "requested admin profile");
        response.render(htmlPath +'/admin.ejs');
    } else {
        response.status(403).send("Access Denied!");
    }
 });
 
 app.get("/user",function(request,response) {
     if (request.session.login && request.session.login.length > 0 ){
         console.log(request.session.login + "requested user profile");
         response.render(htmlPath +'/user.ejs');
     } else {
         response.status(403).send("Access Denied!");
     }
 });

 app.get("/guest",function(request,response) {
     response.render(htmlPath +'/guest.ejs');
 });




