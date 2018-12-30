var mysql= require('mysql');
var io = require('socket.io').listen(3000);
var express = require('express');
var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);

var connection = mysql.createConnection({
    host: 'votingapi-catsvdogs_mysql-dev_1',
    user: 'root',
    password: 'password',
    port: '3306',
    database: 'votingdb'
});

connection.connect(function(err) {
    if(err) {
        console.log('Error: ' + err);
    } else {
        console.log('Connected');
    }
})

var socketCount = 0;
var catScore = 0;
var dogScore = 0;
var isInitLoad = false;

io.sockets.on('connection', function(socket){
    socketCount++;

    io.sockets.emit('users connected', socketCount);

    socket.on('disconnect', function() {
        socketCount--;
        io.sockets.emit('users connected', socketCount);
    });

    socket.on('cat vote', function() {
        connection.query("SELECT vote_count FROM votes WHERE vote_name = 'cats'")
            .on('result', function(data){
                catScore = data.vote_count;
            })
            .on('end', function(){
                io.sockets.emit('catvotes', catScore);
            });
    })

    socket.on('dog vote', function() {
        connection.query("SELECT vote_count FROM votes WHERE vote_name = 'dogs'")
            .on('result', function(data){
                dogScore = data.vote_count;
            })
            .on('end', function(){
                io.sockets.emit('dogvotes', dogScore);
            });
    })

    if (! isInitLoad) {
        connection.query("SELECT vote_count FROM votes WHERE vote_name = 'cats'")
            .on('result', function(data){
                catScore = data.vote_count;
            })
            .on('end', function(){
                socket.emit('catvotes', catScore);
            });

        connection.query("SELECT vote_count FROM votes WHERE vote_name = 'dogs'")
            .on('result', function(data){
                dogScore = data.vote_count;
            })
            .on('end', function(){
                socket.emit('dogvotes', dogScore);
            });
 
        isInitLoad = true;
    } else {
        socket.emit('catvotes', catScore);
        socket.emit('dogvotes', dogScore);
    }
});