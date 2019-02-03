import Database from './Database';

/**
 * @description Party Modal
 */
export default class Party {
  /**
   * s
   */
  constructor() {
    this.table = 'parties';
  }

  /**
   * add Party to database
   * @param {object} option
   * @returns promise
   */
  static async create(option) {
    return Database.insert(new Party().table, option);
  }

  /**
   * view all Partys in database
   * @returns promise
   */
  static async viewAll() {
    return Database.select(new Party().table);
  }

  /**
   * view specific Party in database
   * @param {object} partyid
   * @returns promise
   */
  static async get(partyid) {
    return Database.find(new Party().table, { partyid });
  }

  /**
   * view edit specific Party in database
   * @param {object} name
   * @param {object} partyid
   * @returns promise
   */
  static async edit(name, partyid) {
    return Database.update(new Party().table, { name }, { partyid });
  }

  /**
   * view cand delete specific Party in database
   * @param {object} name
   * @param {object} partyid
   * @returns promise
   */
  static async delete(partyid) {
    return Database.deleteRow(new Party().table, { partyid });
  }
}
