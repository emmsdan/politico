import { expect } from 'chai';
import request from 'supertest';
import app from '../app';
import validate from '../server/helper/validate';

describe('PARTIES REQUEST', () => {
  let AuthToken = '';
  let partyID = '';
  describe('#POST / version 1', () => {
    it('should return unauthorized', (done) => {
      request(app).post('/api/v1/parties')
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

    it('should create new political party', (done) => {
      request(app).post('/api/v1/parties')
        .send({
          name: `people ${validate.generateChar(4)}`,
          hqAddress: `${validate.generateChar(9)}, Lagos`,
          logoUrl: `http://${validate.generateChar(8)}.png`
        })
        .set('x-access-token', `${AuthToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          partyID = res.body.data[0].id;
          if (err) { return done(err); }
          done();
        });
    });

    it('should show all political party', (done) => {
      request(app).get('/api/v1/parties')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          if (err) { return done(err); }
          done();
        });
    });

    it('should get specific political party', (done) => {
      request(app).get(`/api/v1/parties/${partyID}`)
        .set('x-access-token', `${AuthToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          if (err) { return done(err); }
          done();
        });
    });

    it('should rename a specific political party', (done) => {
      request(app).patch(`/api/v1/parties/${partyID}/name`)
        .send({ name: `${validate.generateChar(9)} my helper` })
        .set('x-access-token', `${AuthToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          if (err) { return done(err); }
          done();
        });
    });

    it('should delete a specific political party', (done) => {
      request(app).delete(`/api/v1/parties/${partyID}`)
        .send({ partyid: partyID })
        .set('x-access-token', `${AuthToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(410);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          if (err) { return done(err); }
          done();
        });
    });
  });
});
