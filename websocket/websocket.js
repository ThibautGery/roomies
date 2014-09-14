var debug = require('debug')('chat2');
var http = require('http');
var socket = require('socket.io');
var app = require('../app');
var color = require('../service/color');

var server = http.Server(app);
var io = socket(server);

var map = {};
var numOfUsers = 0;

io.sockets.on('connection', function (socket) {
    debug('client connected ! ');
    numOfUsers++;
    var user = map['user'+ numOfUsers] = {};
    user.color = color.random();

    socket.on('join',function(name){
        debug('new person : '+ name);
        user.nickname = name;
    });

    socket.on('message',function(data){
        debug('message received : '+ data);
        io.emit('message',
            {
                msg : data,
                nickname : user.nickname,
                color: user.color
            }, {for:'everyone'});

    });
});

module.exports = server;