import { expect } from 'chai';
import request from 'supertest';
import app from '../app';
import validate from '../server/helper/validate';

describe('ELECTION REQUEST', () => {
  let AuthToken = '';
  let userID = '';
  let officeID = '';
  let partyID = '';
  let candidateID = ''
  describe('election result', () => {
    it('should return all election results', (done) => {
      request(app).get('/api/v1/office/result')
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
        .set('Cookie', `${process.env.TOKEN_NAME}=${AuthToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          officeID = validate.randomElement(res.body.data[0]).officeid;
          if (err) { return done(err); }
          done();
        });
    });

    it('should show all political party', (done) => {
      request(app).get('/api/v1/parties')
        .set('Cookie', `${process.env.TOKEN_NAME}=${AuthToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          partyID = validate.randomElement(res.body.data[0]).partyid;
          if (err) { return done(err); }
          done();
        });
    });


    describe('vote a candidate', () => {

      it('should return all candidate', (done) => {
        request(app).get('/api/v1/candidate')
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.data).to.be.an('array');
            officeID = validate.randomElement(res.body.data[0]).officeid;
            candidateID = validate.randomElement(res.body.data[0]).candidateid;
            if (err) { return done(err); }
            done();
          });
      });


      it('should return unathorized', (done) => {
        request(app).post('/api/v1/vote')
          .send({
            voter: userID || 1, officeid: officeID, candidate: candidateID
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(401);
            expect(res.body).to.be.an('object');
            expect(res.body.error).to.equal('Unauthorized');
            if (err) { return done(err); }
            done();
          });
      });

      it('should vote candidate', (done) => {
        request(app).post('/api/v1/vote')
          .send({
            voter: userID, officeid: officeID, candidate: candidateID
          })
          .set('Cookie', `${process.env.TOKEN_NAME}=${AuthToken}`)
          .end((err, res) => {
            expect(res.statusCode).to.equal(201);
            expect(res.body).to.be.an('object');
            expect(res.body.data[0]).to.be.an('object');
            officeID = res.body.data[0].officeid;
            candidateID = res.body.data[0].candidate;
            if (err) { return done(err); }
            done();
          });
      });
    });

    describe('election result', () => {
      it('should return no result for specific election', (done) => {
        request(app).get('/api/v1/office/567890/result')
          .end((err, res) => {
            expect(res.statusCode).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body.error).to.equal('no eletion result found for this office');
            if (err) { return done(err); }
            done();
          });
      });

      it('should return all candidate', (done) => {
        request(app).get('/api/v1/candidate')
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.data).to.be.an('array');
            officeID = validate.randomElement(res.body.data[0]).officeid;
            if (err) { return done(err); }
            done();
          });
      });

      it('should return results for specific election', (done) => {
        request(app).get(`/api/v1/office/${officeID}/result`)
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.data).to.an('array');
            if (err) { return done(err); }
            done();
          });
      });

      it('should return all results for election', (done) => {
        request(app).get('/api/v1/office/result')
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.data).to.an('array');
            if (err) { return done(err); }
            done();
          });
      });
    });
  });
});
