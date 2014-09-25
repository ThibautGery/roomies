var server = require('../app'),
    request = require('supertest');


describe('Http chat', function(){
    describe('GET /', function(done){
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
        it('POST /chat', function(done){
            request(server)
                .post('/chat')
                .send({ name: 'azertyutrfdgthyuj' })
                .expect(302, done);
        });
    });

    describe('GET /chat', function(){
        it('GET /chat', function(done){
            request(server)
                .get('/chat/toto')
                .expect(200, done);
        });
    });
});

