import Database from './Database';

/**
 * @description Office Modal
 */
export default class Office {
  /**
   * s
   */
  constructor() {
    this.table = 'offices';
  }


  /**
   * add Office to database
   * @param {object} option
   * @returns promise
   */
  static async create(option) {
    return Database.insert(new Office().table, option);
  }

  /**
   * view all Offices in database
   * @param {object} option
   * @returns promise
   */
  static async viewAll() {
    return Database.select(new Office().table);
  }

  /**
   * view specific Office in database
   * @param {object} option
   * @returns promise
   */
  static async get(officeid) {
    return Database.find(new Office().table, { officeid });
  }
}
