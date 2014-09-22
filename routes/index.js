var express = require('express');
var router = express.Router();

var chat = require('../controllers/chatController');

/* GET home page. */
router.get('/', chat);

router.get('/about', function(req, res) {
    res.render('about', { title: 'About' });
});


router.get('/contact', function(req, res) {
    res.render('contact', { title: 'Contact' });
});

router.get('/chat/:id', function(req, res) {
    res.render('chat', { title: 'Chat' });
});


module.exports = router;
