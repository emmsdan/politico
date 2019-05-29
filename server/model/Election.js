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
   * view users as a candidate
   * @param {object} option
   * @returns promise
   */
  static async viewCandidates() {
    return Database.rawSql(`SELECT parties.id as partyId, parties.logoUrl, offices.id as officeId, offices.name, offices.type, users.id as userid, users.firstname, users.lastname, users.passportUrl FROM candidates 
    INNER JOIN users ON (candidates.userid = users.id)
    INNER JOIN parties ON (candidates.party = parties.id)
    INNER JOIN offices ON (candidates.office = offices.id);`);
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
    return Database.find(new Election().table.petition, { id: petitionid });
  }

  /**
   * view all election result
   * @returns promise
   */
  static async electionResult() {
    const result = await Database.rawSql('SELECT COUNT(votes.id) AS result, candidates.userid as candidate, candidates.office FROM votes JOIN candidates ON candidates.userid = votes.candidate  WHERE votes.candidate = candidates.userid GROUP BY candidates.id, candidates.userid, candidates.office;');
    if (result.rowCount < 1) return 'not found';
    return result.rows;
  }

  /**
   * view specific office results
   * @param {object} office
   * @returns promise
   */
  static async officeResult(office) {
    const result = await Database.rawSql(`SELECT COUNT(votes.id) AS result, candidates.userid as candidate, candidates.office FROM votes JOIN candidates ON candidates.userid = votes.candidate  WHERE votes.candidate = candidates.userid AND votes.office=${office} GROUP BY candidates.id, candidates.userid, candidates.office;`);
    if (result.rowCount < 1) return 'not found';
    return result.rows;
  }
}
