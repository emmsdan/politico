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
   * @param {object} officeid
   * @returns promise
   */
  static async officeResult(officeid) {
    return Database.find(new Election().table.vote, { officeid });
  }
}
