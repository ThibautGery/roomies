var express = require('express');
var router = express.Router();

var chat = require('../controllers/chatController');

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
