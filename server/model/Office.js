import Database from './Database';

/**
 * @description Office Modal
 */
export default class Office {
  /**
   * s
   */
  constructor() {
    this.table = 'office';
  }

  /**
   * init table
   * @returns promise
   */
  static init() {
    Database.create(new Office().table, [
      { name: 'officeid', key: 'primary', type: 'number' },
      { name: 'name', key: 'unique', type: 'string' },
      { name: 'type', type: 'string' },
      { name: 'logoUrl', type: 'string' }
    ])
      .then((res) => { console.log(res.command); })
      .catch((error) => { console.log(error.message); });
  }

  /**
   * add Office to database
   * @param {object} option
   * @returns promise
   */
  static async create(option) {
    return Database.insert(new Office().table, option);
  }
}
Office.init();
