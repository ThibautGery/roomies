var redis = require('../persistence/redis');


var ChatController = function (redisClient) {


    this.getAll = function (req, res) {
        redisClient.smembers('chats', function (err, chats) {
            chats = chats.reverse();
            var errorMessage = req.query.error;
            if(errorMessage == false || errorMessage === null || errorMessage === undefined)
                res.render('index', { title: 'Find your chat', chats: chats, errorMessage : null });
            else
                res.render('index', { title: 'Find your chat', chats: chats, errorMessage : decodeURI(errorMessage)});
        });
    };

    this.get = function (req, res) {
        res.render('chat', { title: 'Chat' });
    };

    this.add = function (req, res) {
        var name = req.body.name;
        if (name == false || name === null || name === undefined) {
            var msg = "The name must be not empty";
            res.redirect('/?error='+(msg));
        }else{

            redisClient.sadd('chats', name);
            res.redirect('/chat/' + name);
        }
    };
};

module.exports =  ChatController;