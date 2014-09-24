var express = require('express');
var router = express.Router();
var redis = require('../persistence/redis');
var chat = require('../controllers/chatController');

chat = new chat(redis);

/* GET home page. */
router.get('/', chat.getAll);

router.get('/about', function(req, res) {
    res.render('about', { title: 'About' });
});


router.get('/contact', function(req, res) {
    res.render('contact', { title: 'Contact' });
});


router.route('/chat')
    .post(chat.add);

router.route('/chat/:name')
    .get(chat.get)

    .put(chat.add)
    .post(function(req, res, next) {
        next(new Error('not implemented'));
    })
    .delete(function(req, res, next) {
        next(new Error('not implemented'));
    });


module.exports = router;
