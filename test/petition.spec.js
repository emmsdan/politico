import { expect } from 'chai';
import request from 'supertest';
import app from '../app';
import validate from '../server/helper/validate';

describe('PETITION REQUEST', () => {
  let AuthToken = '';
  let userID = '';

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
        userID = res.body.data[0].user.id;
        if (err) { return done(err); }
        done();
      });
  });

  it('should file a petition', (done) => {
    request(app).post('/api/v1/petition')
      .send({
        userid: userID,
        office: 1,
        text: 'I think obaje is a thief',
        evidence: 'http://emmdan.cim'
      })
      .set('x-access-token', `${AuthToken}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body.data[0]).to.be.an('object');
        if (err) { return done(err); }
        done();
      });
  });

  it('should return all petitions', (done) => {
    request(app).get('/api/v1/petition')
      .set('x-access-token', `${AuthToken}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data[0]).to.be.an('object');
        if (err) { return done(err); }
        done();
      });
  });

  it('should return specific petitions', (done) => {
    request(app).get('/api/v1/petition/1')
      .set('x-access-token', `${AuthToken}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data[0]).to.be.an('array');
        if (err) { return done(err); }
        done();
      });
  });

  it('should not return specific petitions', (done) => {
    request(app).get('/api/v1/petition/13')
      .set('x-access-token', `${AuthToken}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data[0]).to.be.an('string');
        if (err) { return done(err); }
        done();
      });
  });
});
