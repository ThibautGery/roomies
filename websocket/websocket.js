var debug = require('debug')('chat2');
var http = require('http');
var socket = require('socket.io');
var app = require('../app');
var color = require('../service/color');
var redis = require('redis');
var redisClient = redis.createClient();

var server = http.Server(app);
var io = socket(server);

var map = {};
var numOfUsers = 0;

io.sockets.on('connection', function (socket) {
    debug('client connected ! ');
    numOfUsers++;
    var user = map['user'+ numOfUsers] = {};
    user.color = color.random();
    user.id = socket.id;

    socket.on('join',function(name){
        debug('new person : '+ name);
        user.nickname = name;
        redisClient.sadd('users',JSON.stringify(user));
        socket.broadcast.emit('newUser',
            {
                nickname : user.nickname,
                color: user.color,
                id : user.id
            });

        redisClient.smembers('users',  function (err, users) {
            users = users.reverse();
            users.forEach(function(user){
                user = JSON.parse(user);
                socket.emit("oldUser",user);
            });
        });
        redisClient.lrange('messages', 0, -1, function (err, messages) {
            messages = messages.reverse();
            messages.forEach(function(message){
                message = JSON.parse(message);
                socket.emit("message",message);
            });
        });
    });

    socket.on('userleft',function(){
        debug('userleft : '+ user.nickname);
        redisClient.srem('users',JSON.stringify(user));
        socket.broadcast.emit('userleft',
            {
                id : user.id,
                nickname : user.nickname,
                color : user.color
            });
    });

    socket.on('message',function(data){
        debug('message received : '+ data);
        var msg = {
            msg : data,
            nickname : user.nickname,
            color: user.color
        };
        redisClient.lpush('messages',JSON.stringify(msg),function(){
            redisClient.ltrim('msg',0, 100);
        });
        io.emit('message', msg
            , {for:'everyone'});

    });
});

module.exports = server;