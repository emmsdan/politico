import { chai, expect } from 'chai';
import request from 'supertest';
import app from '../app';

describe('Party API Integration Tests', () => {
  describe('#GET / Party', () => {
    it('should respond with json containing a list of all political parties', (done) => {
      request(app).get('/v1/parties')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.name).equal('politico');
          done();
        });
    });
  });
});
