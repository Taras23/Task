module.exports= function(io){
users = [];
connections = [];

io.sockets.on('connection',function(socket){
    connections.push(socket);
console.log('Connection successful')
    socket.on('disconnect', function(data){
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnect successful')
    });
    socket.on('send mess', function(data){
        io.sockets.emit('add mess', data);
    })
});
}