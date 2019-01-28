import { chai, expect } from 'chai';
import request from 'supertest';
import app from '../app';

describe('test if server is up and running', () => {
  describe('#GET / version 1', () => {
    it('should get v1 content', (done) => {
      request(app).get('/')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.text).equal('Official App for Politico API');
          done();
        });
    });
  });
});
