import { expect } from 'chai';
import request from 'supertest';
import app from '../app';
import validate from '../server/helper/validate';

describe('AUTHENTICATION REQUEST', () => {
  describe('#POST / version 1', () => {
    it('should not login user (details incorrect)', (done) => {
      request(app).post('/api/v1/auth/login')
        .send({ username: 'wrong@wrong.com', password: 'wrong1230' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an('object');
          if (err) { return done(err); }
          done();
        });
    });

    it('should register a new user (details correct)', (done) => {
      request(app).post('/api/v1/auth/signup')
        .send({
          email: `emmsdan${validate.generateChar(7)}@gmail.com`,
          phoneNumber: validate.generateNumber(10),
          firstName: 'another',
          lastName: 'newname',
          password: 'eternity123',
          role: 'user',
          passportUrl: 'eternity123'
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          if (err) { return done(err); }
          done();
        });
    });

    it('should login user (details correct)', (done) => {
      request(app).post('/api/v1/auth/login')
        .send({ username: 'ecomje@gmail.com', password: 'eternity123' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          if (err) { return done(err); }
          done();
        });
    });

    it('should send reset link to mail', (done) => {
      request(app).post('/api/v1/auth/reset')
        .send({ email: 'ecomje@gmail.com' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          if (err) { return done(err); }
          done();
        });
    });
  });
});
