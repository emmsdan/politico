import { expect } from 'chai';
import request from 'supertest';
import app from '../app';

describe('test if server is up and running', () => {
  describe('#GET / version 1', () => {
    it('start server', (done) => {
      request(app).get('/api/v1/')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.text).equal('Official App for Politico API');
          done();
        });
    });
    it('should migrate before statrt', (done) => {
      request(app).purge('/migrate')
        .end((err, res) => {
          console.log(res.body);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.m).to.equal('migrated');
          done();
        });
    });
  });
});
