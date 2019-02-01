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
    CREATE TABLE IF NOT EXISTS ${new Election().table.candidate} (id SERIAL, candidateid numeric, officeid Numeric REFERENCES offices(officeid), partyid Numeric REFERENCES parties(partyid), createdOn timestamp not null default CURRENT_TIMESTAMP, updatedOn timestamp not null default CURRENT_TIMESTAMP, PRIMARY KEY(candidateid));

    CREATE TABLE IF NOT EXISTS ${new Election().table.vote} (id SERIAL, office Numeric, voter Numeric, createdOn timestamp not null default CURRENT_TIMESTAMP, updatedOn timestamp not null default CURRENT_TIMESTAMP, PRIMARY KEY(id));

    CREATE TABLE IF NOT EXISTS ${new Election().table.petition} (id SERIAL, petitionid Numeric, createdBy Numeric, officeid Numeric REFERENCES offices(officeid), title VARCHAR, body TEXT,evidence VARCHAR, createdOn timestamp not null default CURRENT_TIMESTAMP, updatedOn timestamp not null default CURRENT_TIMESTAMP, PRIMARY KEY(petitionid));`)
      .then((res) => { console.log(res); })
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
}
Election.init();
