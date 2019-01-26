import { chai, expect } from 'chai';
import request from 'supertest';
import app from '../app';

describe('Party Intergreted Test', () => {
  const party = {
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
});
