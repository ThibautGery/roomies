var debug = require('debug')('chat2');
var http = require('http');
var socket = require('socket.io');
var app = require('../app');
var colorS = require('../service/color');




var map = {};
var numOfUsers = 0;



var websocket = function(redis, server){
    redis.sismember('chats','default', function(err, value) {
        if (!value) {
            redis.sadd('chats', 'default');
        }
    });
    this.io = socket(server);
    this.server = server;
    this.io.sockets.on('connection', function (socket) {
        debug('client connected ! ');
        //TODO : à mettre dans redis
        numOfUsers++;
        var user = map['user'+ numOfUsers] = {};
        user.id = socket.id;

        socket.on('join',function(name, room, color){
            room = decodeURI(room);
            redis.sismember('chats',room, function(err, value) {
                if (!value) {
                    socket.emit("roomNotExisting",room);
                }else{
                    socket.join(room);
                    debug('new person : '+ name);
                    user.nickname = name || 'anonymous';
                    user.room = room;
                    if(color === undefined || color === null) {
                        user.color = colorS.random();
                    }else{
                        user.color = color;
                    }
                    redis.sadd(room+'users',JSON.stringify(user));
                    socket.broadcast.in(room).emit('newUser',
                        {
                            nickname : user.nickname,
                            color: user.color,
                            id : user.id
                        });

                    redis.smembers(room+'users',  function (err, users) {
                        users = users.reverse();
                        users.forEach(function(user){
                            user = JSON.parse(user);
                            socket.emit("oldUser",user);
                        });
                    });
                    redis.lrange(room+'messages', 0, -1, function (err, messages) {
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
                redis.srem(user.room + 'users', JSON.stringify(user), function (err) {
                    socket.broadcast.in(user.room).emit('userleft',
                        {
                            id: user.id,
                            nickname: user.nickname,
                            color: user.color
                        });

                    redis.scard(user.room + 'users', function (err, value) {
                        if (value === 0 && user.room != 'default') {
                            redis.srem('chats', user.room);
                            redis.del(user.room + 'users');
                            redis.del(user.room + 'messages');
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
            redis.lpush(user.room+'messages',JSON.stringify(msg),function(){
                redis.ltrim(user.room+'messages',0, 100);
            });
            socket.broadcast.in(user.room).emit('message', msg);

        });
    });
};



module.exports = websocket;