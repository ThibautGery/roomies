var serverRequire = require('../websocket/websocket'),
    io = require('socket.io-client');


describe('Websocket chat', function(){

    var socket;

    var server = serverRequire;

    before(function(done) {
        console.log('server starting...');
        server.listen(3001, function(){
            console.log('server started...');
            done();
        });

        server.on('close',function(){
            console.log('server closed...');
        });

    });

    after(function() {
        console.log('server closing...');
        server.close(function(){
            console.log('server closed...');
        });

    });


    beforeEach(function(done) {
        // Setup
        var url = server.address();
        socket = io.connect('http://'+url.address +':'+url.port, {
            'reconnection delay' : 0
            , 'reopen delay' : 0
            , 'force new connection' : true
        });
        socket.on('connect', function() {
            console.log('connected...');
            done();
        });
        socket.on('disconnect', function() {
            console.log('disconnected...');
        })
    });

    afterEach(function(done) {
        // Cleanup
        if(socket.connected) {
            console.log('WS disconnecting...');
            socket.disconnect();
        } else {
            // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
            console.log('WS : no connection to break...');
        }
        done();
    });



        it(' should join correctely', function(done){
            socket.emit('join', 'userName', 'chatName', '#000000');
            done();
        });


});

