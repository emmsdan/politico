import { expect } from 'chai';
import request from 'supertest';
import app from '../app';
import validate from '../server/helper/validate';

describe('CANDIDATE REQUEST', () => {
  let AuthToken = '';
  let userID = '';
  let officeID = '';
  let partyID = '';
  describe('Candidates', () => {
    it('should return all candidate', (done) => {
      request(app).get('/api/v1/candidate')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
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
          userID = res.body.data[0].user.userid;
          if (err) { return done(err); }
          done();
        });
    });

    it('should get all political offices', (done) => {
      request(app).get('/api/v1/offices')
        .set('x-access-token', `${AuthToken}`)
        .set('token', `${AuthToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          officeID = validate.randomElement(res.body.data[0]).id;
          if (err) { return done(err); }
          done();
        });
    });

    it('should show all political party', (done) => {
      request(app).get('/api/v1/parties')
        .set('x-access-token', `${AuthToken}`)
        .set('token', `${AuthToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          partyID = validate.randomElement(res.body.data[0]).id;
          if (err) { return done(err); }
          done();
        });
    });

    it('should show all users', (done) => {
      request(app).get('/api/v1/users')
        .set('x-access-token', `${AuthToken}`)
        .set('token', `${AuthToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          userID = validate.randomElement(res.body.data[0]).id;
          if (err) { return done(err); }
          done();
        });
    });

    it('should return unauthorized', (done) => {
      request(app).post(`/api/v1/office/${userID}/register`)
        .send({
          userid: userID, office: officeID, party: partyID
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.equal('Unauthorized');
          if (err) { return done(err); }
          done();
        });
    });

    it('should register a candidate', (done) => {
      request(app).post(`/api/v1/office/${userID}/register`)
        .send({
          userid: userID, office: officeID, party: partyID
        })
        .set('x-access-token', `${AuthToken}`)
        .set('token', `${AuthToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          if (err) { return done(err); }
          done();
        });
    });
  });
});
