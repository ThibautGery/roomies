var expect = require('chai').expect;
var assert = require("assert");
var sinon = require("sinon");
var chat = require('../controllers/chatController');

describe('ChatController', function(){
    var redis = {};
    var chatController = new chat(redis);
    var req = {};
    var res = {};

    describe('getAll', function(){
        it('Should get all chats', function(){
            //given
            redis.smembers = sinon.spy();

            //when
            chatController.getAll(req,res);

            //then
            expect(redis.smembers.calledWith("chats", sinon.match.func)).to.be.true;
        })
    });

    describe('get', function(){
        it('Should get a chat', function(){
            //given
            res.render = sinon.spy();


            //when
            chatController.get(req,res);

            //then
            expect(res.render.calledWith("chat", { title: 'Chat' })).to.be.true;
        })
    });

    describe('add', function(){
        it('Should create a chat when provided a name', function(){
            //given
            req.body = {};
            req.body.name = 'toto';
            res.redirect = sinon.spy();
            redis.sadd = sinon.spy();

            //when
            chatController.add(req,res);

            //then
            expect(redis.sadd.calledWith("chats", 'toto')).to.be.true;
            expect(res.redirect.calledWith("/chat/toto")).to.be.true;
        })
    });
});