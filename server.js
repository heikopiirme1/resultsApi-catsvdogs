var express = require('express');
var mysql= require('mysql');
var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);

var connection = mysql.createConnection({
    host: 'localhost',
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

app.get('/catresults', function(req, res){
    var query = "SELECT vote_count FROM votes WHERE vote_name = 'cats'";
    connection.query(query, (err, rows, fields) => {
        if(err){
            console.log("Query failed: " + err);
            res.sendStatus(500);
        }
        res.json(rows[0].vote_count);
    });
    
});

app.get('/dogresults', function(req, res){
    var query = "SELECT vote_count FROM votes WHERE vote_name = 'dogs'";
    connection.query(query, (err, rows, fields) => {
        if(err){
            console.log("Query failed: " + err);
            res.sendStatus(500);
        }
        res.json(rows[0].vote_count);
    });
    
});

app.listen(3000);