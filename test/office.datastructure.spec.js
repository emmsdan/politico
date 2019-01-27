import { expect } from 'chai';
import request from 'supertest';
import app from '../app';

describe('Government Office Intergreted Test', () => {
  const office = {
    officeID: 1234,
    name: 'House of representative',
    logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeEy3OA3OHeXypU1Hx94fSZIAYc5Lu1ZFjy_3o9g_qKaDKPZRH',
    officeType: 'federal'
  };

  const invalidoffice = {
    officeType: 'state'
  };

  describe('#POST /api/v1/offices "create new office."', () => {
    it('should create a new office', (done) => {
      request(app).post('/api/v1/offices')
        .send(office)
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          done();
        });
    });
    it('should throw an error: "office already exist"', (done) => {
      request(app).post('/api/v1/offices')
        .send(office)
        .end((err, res) => {
          expect(res.statusCode).to.equal(406);
          expect(res.body.error).equals('office already exist');
          done();
        });
    });
  });

  describe('#GET /api/v1/offices "view all government offices."', () => {
    it('should return a list of all government offices', (done) => {
      request(app).get('/api/v1/offices/')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.data).to.be.an('array');
          done();
        });
    });

    it('should return specific government office', (done) => {
      request(app).get(`/api/v1/offices/${office.officeID}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.data).to.be.an('array');
          done();
        });
    });

    it('should return invalid error', (done) => {
      request(app).get('/api/v1/offices/wrong123')
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body.error).to.equal('please provide a valid office id');
          done();
        });
    });
  });
});
