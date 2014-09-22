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

redisClient.sismember('chats','default', function(err, value) {
    if (!value) {
        redisClient.sadd('chats', 'default');
    }
});



io.sockets.on('connection', function (socket) {
    debug('client connected ! ');
    numOfUsers++;
    var user = map['user'+ numOfUsers] = {};
    user.id = socket.id;

    socket.on('join',function(name, room, color){
        room = decodeURI(room);
        redisClient.sismember('chats',room, function(err, value) {
            if (!value) {
                socket.emit("roomNotExisting",room);
            }else{
                socket.join(room);
                debug('new person : '+ name);
                user.nickname = name || 'anonymous';
                user.room = room;
                if(color === undefined || color === null) {
                    user.color = color.random();
                }else{
                    user.color = color;
                }
                redisClient.sadd(room+'users',JSON.stringify(user));
                socket.broadcast.in(room).emit('newUser',
                    {
                        nickname : user.nickname,
                        color: user.color,
                        id : user.id
                    });

                redisClient.smembers(room+'users',  function (err, users) {
                    users = users.reverse();
                    users.forEach(function(user){
                        user = JSON.parse(user);
                        socket.emit("oldUser",user);
                    });
                });
                redisClient.lrange(room+'messages', 0, -1, function (err, messages) {
                    messages = messages.reverse();
                    messages.forEach(function(message){
                        message = JSON.parse(message);
                        socket.emit("message",message);
                    });
                });
            }
        });

    });

    socket.on('disconnect',function(){
        debug('disconnect : '+ user.nickname);
        if(user.nickname !== undefined) {
            redisClient.srem(user.room + 'users', JSON.stringify(user), function (err) {
                socket.broadcast.in(user.room).emit('userleft',
                    {
                        id: user.id,
                        nickname: user.nickname,
                        color: user.color
                    });

                redisClient.scard(user.room + 'users', function (err, value) {
                    if (value === 0 && user.room != 'default') {
                        redisClient.srem('chats', user.room);
                        redisClient.del(user.room + 'users');
                        redisClient.del(user.room + 'messages');
                    }
                });
            });
        }
    });

    socket.on('message',function(data){
        debug('message received : '+ data);
        var msg = {
            msg : data,
            nickname : user.nickname,
            color: user.color
        };
        redisClient.lpush(user.room+'messages',JSON.stringify(msg),function(){
            redisClient.ltrim(user.room+'messages',0, 100);
        });
        socket.broadcast.in(user.room).emit('message', msg);

    });
});

module.exports = server;