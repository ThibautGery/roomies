var server = require('../websocket/websocket'),
    request = require('supertest');

var done = function(err, res){
    if (err) throw err;
};

describe('Http chat', function(){
    describe('GET /', function(){
        it('GET /', function(){
            request(server)
                .get('/')
                .expect(200, done);
        });

        it('GET /?error=toto', function(){
            request(server)
                .get('/?error=toto')
                .expect(412, done);
        });
    });

    describe('POST /chat', function(){
        it('POST /chat', function(){
            request(server)
                .post('/chat')
                .send({ name: 'azertyutrfdgthyuj' })
                .expect(302, done);
        });
    });

    describe('GET /chat', function(){
        it('GET /chat', function(){
            request(server)
                .get('/chat/toto')
                .expect(200, done);
        });
    });
});

