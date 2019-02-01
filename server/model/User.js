import Database from './Database';

/**
 * @description User Modal
 */
export default class User {
  /**
   * s
   */
  constructor() {
    this.table = 'users';
  }

  /**
   * init table
   * @returns promise
   */
  static init() {
    Database.create(new User().table, [
      { name: 'userid', key: 'primary', type: 'number' },
      { name: 'name', type: 'string' },
      { name: 'email', key: 'unique', type: 'string' },
      { name: 'phone', key: 'unique', type: 'number' },
      { name: 'password', type: 'text' },
      { name: 'role', type: 'string' }
    ])
      .then((res) => { console.log(res.command); })
      .catch((error) => { console.log(error.message); });
  }

  /**
   * add user to database
   * @param {object} option
   * @returns promise
   */
  static async register(option) {
    return Database.insert(new User().table, option);
  }

  /**
   * findUser
   * @param {object} option
   * @returns promise
   */
  static async findUser(option) {
    return Database.find(new User().table, option, 'OR');
  }

  /**
   * findUser
   * @param {object} option
   * @returns promise
   */
  static async getAll() {
    return Database.select(new User().table);
  }

  /**
   * login user to database
   * @param {object} option
   * @returns promise
   */
  static async login(option) {
    return Database.find(new User().table, option, 'OR');
  }
}
User.init();
