import Database from './Database';

/**
 * @description Election Modal
 */
export default class Election {
  /**
   * s
   */
  constructor() {
    this.table = {
      candidate: 'candidates',
      vote: 'votes',
      petition: 'petitions'
    };
  }

  /**
   * init Election tables
   * @returns promise
   */
  static init() {
    Database.rawSql(`
    CREATE TABLE IF NOT EXISTS ${new Election().table.candidate} (id SERIAL, candidateid numeric  REFERENCES users(userid), officeid Numeric REFERENCES offices(officeid), partyid Numeric REFERENCES parties(partyid), createdOn timestamp not null default CURRENT_TIMESTAMP, updatedOn timestamp not null default CURRENT_TIMESTAMP, PRIMARY KEY(candidateid), PRIMARY KEY(partyid));

    CREATE TABLE IF NOT EXISTS ${new Election().table.vote} (id SERIAL, office Numeric REFERENCES offices(officeid), candidate numeric  REFERENCES candidates(candidateid), voter Numeric  REFERENCES users(userid), createdOn timestamp not null default CURRENT_TIMESTAMP, updatedOn timestamp not null default CURRENT_TIMESTAMP, PRIMARY KEY(id));

    CREATE TABLE IF NOT EXISTS ${new Election().table.petition} (id SERIAL, petitionid Numeric, createdBy Numeric, officeid Numeric REFERENCES offices(officeid), title VARCHAR, body TEXT,evidence VARCHAR, createdOn timestamp not null default CURRENT_TIMESTAMP, updatedOn timestamp not null default CURRENT_TIMESTAMP, PRIMARY KEY(petitionid));`)
      .then((res) => { console.log(res[0].command); })
      .catch((error) => { console.log(error.message); });
  }

  /**
   * file a petition against and Election
   * @param {object} option
   * @returns promise
   */
  static async createPetition(option) {
    return Database.insert(new Election().table.petition, option);
  }


  /**
   * register a user as a candidate
   * @param {object} option
   * @returns promise
   */
  static async newVote(option) {
    return Database.insert(new Election().table.vote, option);
  }

  /**
   * register a user as a candidate
   * @param {object} option
   * @returns promise
   */
  static async newCandidate(option) {
    return Database.insert(new Election().table.candidate, option);
  }

  /**
   * register a user as a candidate
   * @param {object} option
   * @returns promise
   */
  static async viewCandidates() {
    return Database.select(new Election().table.candidate);
  }

  /**
   * register a user as a candidate
   * @param {object} option
   * @returns promise
   */
  static async viewCandidate(id) {
    return Database.find(new Election().table.candidate, {
      officeid: id,
      partyid: id
    }, 'or');
  }

  /**
   * view all petitions
   * @returns promise
   */
  static async viewAllPetition() {
    return Database.select(new Election().table.petition);
  }

  /**
   * view specific petition
   * @param {object} petitionid
   * @returns promise
   */
  static async getPetition(petitionid) {
    return Database.find(new Election().table.petition, { petitionid });
  }

  /**
   * view all election result
   * @returns promise
   */
  static async electionResult() {
    return Database.select(new Election().table.vote);
  }

  /**
   * view specific office results
   * @param {object} office
   * @returns promise
   */
  static async officeResult(office) {
    return Database.find(new Election().table.vote, { office });
  }
}
Election.init();
