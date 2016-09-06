const app = require('../server');

//----------Testing libs
const expect = require('chai').expect;
var supertest = require('supertest');
var request = supertest.agent(app);
//-------------------------


describe('/update should be an API route', function () {
  it('should return with a 200', function (done) {
    request
      .get('/update')
      .expect(200, done);
  });
});