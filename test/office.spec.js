import { expect } from 'chai';
import request from 'supertest';
import app from '../app';
import validate from '../server/helper/validate';

describe('OFFICE REQUEST', () => {
  let AuthToken = '';
  let officeID = '';
  describe('#POST Create Office', () => {
    it('Unauthorized: non admin users.', (done) => {
      request(app).post('/api/v1/offices')
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.equal('Unauthorized');
          if (err) { return done(err); }
          done();
        });
    });

    it('should login user', (done) => {
      request(app).post('/api/v1/auth/login')
        .send({
          username: 'ecomje@gmail.com',
          password: 'eternity123'
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          AuthToken = res.body.data[0].token;
          if (err) { return done(err); }
          done();
        });
    });

    it('should create new political office', (done) => {
      request(app).post('/api/v1/offices')
        .send({
          name: `people ${validate.generateChar(4)}`,
          type: 'legislative'
        })
        .set('Cookie', `${process.env.TOKEN_NAME}=${AuthToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          officeID = res.body.data[0].officeid;
          if (err) { return done(err); }
          done();
        });
    });

    it('should return incorrect name format', (done) => {
      request(app).post('/api/v1/offices')
        .send({
          name: 'people -- ',
          type: 'legislative',
          logoUrl: 'http://some.png'
        })
        .set('Cookie', `${process.env.TOKEN_NAME}=${AuthToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.equal('incorrect name format');
          if (err) { return done(err); }
          done();
        });
    });

    it('should return incorrect office type format', (done) => {
      request(app).post('/api/v1/offices')
        .send({
          name: 'people them',
          logoUrl: 'http://some.png'
        })
        .set('Cookie', `${process.env.TOKEN_NAME}=${AuthToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.equal('incorrect office type format');
          if (err) { return done(err); }
          done();
        });
    });
  });
  describe('#GET Get offices', () => {
    it('Unauthorized, non logged in users.', (done) => {
      request(app).get('/api/v1/offices')
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.equal('Unauthorized');
          if (err) { return done(err); }
          done();
        });
    });

    it('should show all political office', (done) => {
      request(app).get('/api/v1/offices')
        .set('Cookie', `${process.env.TOKEN_NAME}=${AuthToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          if (err) { return done(err); }
          done();
        });
    });

    it('unauthorized: specific office', (done) => {
      request(app).get(`/api/v1/offices/${officeID}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.equal('Unauthorized');
          if (err) { return done(err); }
          done();
        });
    });

    it('should get specific political office', (done) => {
      request(app).get(`/api/v1/offices/${officeID}`)
        .set('Cookie', `${process.env.TOKEN_NAME}=${AuthToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          if (err) { return done(err); }
          done();
        });
    });
  });
});
