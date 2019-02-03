import { expect } from 'chai';
import request from 'supertest';
import app from '../app';

describe('AUTHENTICATION REQUEST', () => {
  describe('#POST / version 1', () => {
    it('should not login user (details incorrect)', (done) => {
      request(app).post('/api/v1/auth/login')
        .send({ username: 'wrong@wrong.com', password: 'wrong1230' })
        .end((err, res) => {
          console.log(res.body);
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an('object');
          if (err) { return done(err); }
          done();
        });
    });

    it('should register a new user (details correct)', (done) => {
      request(app).post('/api/v1/auth/signup')
        .send({
          email: `emmsdan${Math.random()}@gmail.com`,
          phone: `${Math.random()}`,
          name: 'another name',
          password: 'eternity123',
          photoUrl: 'eternity123'
        })
        .end((err, res) => {
          console.log(res.body);
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
          console.log(res.body);
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
          console.log(res.body);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          if (err) { return done(err); }
          done();
        });
    });
  });
});
