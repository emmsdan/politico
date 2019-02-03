import { expect } from 'chai';
import request from 'supertest';
import app from '../app';
import validate from '../server/helper/validate';

describe('PETITION REQUEST', () => {
  let AuthToken = '';
  let userID = '';
  let officeID = '';

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
        userID = res.body.data[0].user.userid;
        if (err) { return done(err); }
        done();
      });
  });

  it('should file a petition', (done) => {
    request(app).post('/api/v1/petition')
      .send({
        userid: userID,
        officeid: 1,
        comment: 'I think obaje is a thief',
        evidence: 'http://emmdan.cim'
      })
      .set('Cookie', `${process.env.TOKEN_NAME}=${AuthToken}`)
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
      .set('Cookie', `${process.env.TOKEN_NAME}=${AuthToken}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data[0]).to.be.an('object');
        if (err) { return done(err); }
        done();
      });
  });
});
