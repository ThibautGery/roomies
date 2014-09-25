var websocket = require('../websocket/websocket'),
    io = require('socket.io-client'),
    http = require('http'),
    sinon = require("sinon"),
    redisReq =require('../persistence/redis'),
     redisClient = require('../persistence/redis');


describe('Websocket chat', function(){

    var socketClient;
    var socketServer;

    var server;
    var redis = {};

    before(function(done) {
        redis.sismember = sinon.spy();
        socketServer = new websocket(redis, http.createServer());
        server = socketServer.server;

        console.log('server starting...');
        server.listen(3001, function(){
            console.log('server started...');
            done();
        });

        server.on('close',function(){
            console.log('server closed...');
        });

    });

    beforeEach(function(done) {
        // Setup
        var url = server.address();
        socketClient = io.connect('http://'+url.address +':'+url.port, {
            'reconnection delay' : 0
            , 'reopen delay' : 0
            , 'force new connection' : true
        });
        socketClient.on('connect', function() {
            console.log('connected...');
            done();
        });
        socketClient.on('disconnect', function() {
            console.log('disconnected...');
        })
    });

    afterEach(function(done) {
        // Cleanup
        if(socketClient.connected) {
            console.log('WS disconnecting...');
            socketClient.disconnect();
        } else {
            // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
            console.log('WS : no connection to break...');
        }
        done();
    });



        it(' should join correctely', function(done){

            socketClient.emit('join', 'userName', 'chatName', '#000000');
            done();
        });


});

