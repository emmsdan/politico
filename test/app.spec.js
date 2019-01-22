const expect = require('chai').expect
const server = require('../app');

describe('test', () => {
  it('should return a string', () => {
    expect('Official App for Politico API').to.equal('Official App for Politico API');
  });
});
