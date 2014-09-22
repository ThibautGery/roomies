var redis = require('redis');
var redisClient = redis.createClient();


var getAll =  function(req, res) {
    redisClient.smembers('chats', function (err, chats) {
            chats = chats.reverse();
            res.render('index', { title: 'Find your chat' , chats : chats });
        });

};

var get = function(req, res) {
    res.render('chat', { title: 'Chat' });
};

var add = function(req, res) {
    var name = req.body.name;
    redisClient.sadd('chats',name);
    res.redirect('/chat/'+name);
};

module.exports.getAll = getAll;
module.exports.get = get;
module.exports.add = add;