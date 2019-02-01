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
   * init table
   * @returns promise
   */
  static init() {
    Database.create(new Party().table, [
      { name: 'partyid', key: 'primary', type: 'number' },
      { name: 'name', key: 'unique', type: 'string' },
      { name: 'hqAddress', type: 'string' },
      { name: 'logoUrl', type: 'string' }
    ])
      .then((res) => { console.log(res.command); })
      .catch((error) => { console.log(error.message); });
  }

  /**
   * add Party to database
   * @param {object} option
   * @returns promise
   */
  static async create(option) {
    return Database.insert(new Party().table, option);
  }
}
Party.init();
