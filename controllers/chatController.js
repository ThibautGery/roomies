var redis = require('redis');
var redisClient = redis.createClient();


var controller =  function(req, res) {
    redisClient.smembers('chats', function (err, chats) {
            chats = chats.reverse();
            res.render('index', { title: 'Find your chat' , chats : chats });
        });

};


module.exports = controller;