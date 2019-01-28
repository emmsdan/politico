import { expect } from 'chai';
import request from 'supertest';
import app from '../app';

describe('Party Intergreted Test', () => {
  const party = {
    partyID: 1234,
    name: 'Labour Party',
    logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeEy3OA3OHeXypU1Hx94fSZIAYc5Lu1ZFjy_3o9g_qKaDKPZRH',
    address: 'Andela Epic tower, Ilupeju road, Lagos'
  };

  const invalidParty = {
    address: 'African United Sport, London'
  };

  describe('#POST /api/v1/parties "create new political party."', () => {
    it('should create a new party', (done) => {
      request(app).post('/api/v1/parties')
        .send(party)
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          done();
        });
    });
    it('should throw an error: "party already exist"', (done) => {
      request(app).post('/api/v1/parties')
        .send(party)
        .end((err, res) => {
          expect(res.statusCode).to.equal(406);
          expect(res.body.error).equals('party already exist');
          done();
        });
    });
    it('should throw an error: "please check input"', (done) => {
      request(app).post('/api/v1/parties')
        .send(invalidParty)
        .end((err, res) => {
          expect(res.statusCode).to.equal(406);
          expect(res.body.error).equals('please check input');
          done();
        });
    });
  });

  describe('#GET /api/v1/parties "view all political party."', () => {
    it('should return a list all available political party', (done) => {
      request(app).get('/api/v1/parties')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.data).to.be.an('array');
          done();
        });
    });

    it('should return specific political party', (done) => {
      request(app).get(`/api/v1/parties/${party.partyID}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.data).to.be.an('array');
          done();
        });
    });

    it('should return invalid error', (done) => {
      request(app).get('/api/v1/parties/wrong123')
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body.error).to.equal('please provide a valid party id');
          done();
        });
    });
  });

  describe('#PATCH /api/v1/parties/partID/name "edit specific political party name."', () => {
    it('should trigger an error', (done) => {
      request(app).patch(`/api/v1/parties/${party.partyID}/name`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body.error).to.equal('invalid name, supplied');
          done();
        });
    });

    it('should return new party name', (done) => {
      request(app).patch(`/api/v1/parties/${party.partyID}/name`)
        .send({
          name: 'Action congress'
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });

  describe('#DELETE /api/v1/parties/partID "delete specific political party."', () => {
    it('should return successful action', (done) => {
      request(app).delete(`/api/v1/parties/${party.partyID}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(410);
          expect(res.body.data[0]).to.equal('party delete successfully');
          done();
        });
    });

    it('should return party does not exist', (done) => {
      request(app).get(`/api/v1/parties/${party.partyID}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body.error).to.equal('no registered party with such ID');
          done();
        });
    });
  });
});
