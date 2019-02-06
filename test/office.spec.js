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
        .set('x-access-token', `${AuthToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          officeID = res.body.data[0].id;
          if (err) { return done(err); }
          done();
        });
    });


    it('should return incorrect office type/name format', (done) => {
      request(app).post('/api/v1/offices')
        .send({
          name: 'people them',
          logoUrl: 'http://some.png'
        })
        .set('x-access-token', `${AuthToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.equal('incorrect office type/name format');
          if (err) { return done(err); }
          done();
        });
    });
  });
  describe('#GET Get offices', () => {
    it('should show all political office', (done) => {
      request(app).get('/api/v1/offices')
        .set('x-access-token', `${AuthToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          if (err) { return done(err); }
          done();
        });
    });

    it('should get specific political office', (done) => {
      request(app).get(`/api/v1/offices/${officeID}`)
        .set('x-access-token', `${AuthToken}`)
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
