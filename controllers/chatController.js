var redis = require('../persistence/redis');


var ChatController = function (redisClient) {


    this.getAll = function (req, res) {
        redisClient.smembers('chats', function (err, chats) {
            chats = chats.reverse();
            res.render('index', { title: 'Find your chat', chats: chats });
        });
    };

    this.get = function (req, res) {
        res.render('chat', { title: 'Chat' });
    };

    this.add = function (req, res) {
        var name = req.body.name;
        redisClient.sadd('chats', name);
        res.redirect('/chat/' + name);
    };
};

module.exports =  ChatController;