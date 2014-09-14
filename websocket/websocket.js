var debug = require('debug')('chat2');
var http = require('http');
var socket = require('socket.io');
var app = require('../app');

var server = http.Server(app);
var io = socket(server);

io.on('connection', function (socket) {
    debug('client connected ! ');
    socket.on('message',function(data){
        debug('message received : '+ data);
        io.emit('message',data, {for:'everyone'});
        debug('broadcasted');
    });
});

module.exports = server;