/* eslint-disable guard-for-in */
import validator from 'validator';
import responseController from '../controller/responseController';
/**
 * validate custom user input
 */
class validate {
  /**
	 * validate address:
	 * @description the isAddress methods will pass only
	 * if the string contains alphabets, numbers, spaces, period, comma, and dash
	 * @param {string} address
	 * @returns boolean
	 */
  static isAddress(address) {
    return address ? (/^[a-zAZ0-9,.-\s]+$/i.test(address)) : false;
  }

  /**
	 * @description allow only alphabets and spaces
	 * @param {string} name
	 * @returns boolean
	 */
  static isName(name) {
    return name ? (/^[A-Za-z\s]+$/.test(name)) : false;
  }

  /**
	 * @description check if string is digit
	 * @param {string} string
	 * @returns boolean
	 */
  static isInt(string) {
    return string ? (/^[0-9]+$/i.test(string)) : false;
  }

  /**
   * @description check if party exist
   * @param {string} name
   * @returns boolean
   */
  static itExist(data, name) {
    const found = data.find(element => element.name === name);
    if (found) return true;
    return false;
  }

  /**
	 *
	 * @param {string/number} id
	 * @param {object} response
	 * @returns object
	 */
  static isValidID(id, response) {
    if (!validator.isInt(id) || !id) {
      return responseController.response({
        status: 400,
        message: 'empty/incorrect id.'
      }, null, response);
    }
  }

  /**
   *  @example options = {
   *  find: replaceWith
   * }
   * @param {object} options
   * @param {string} data
   * @returns object
   */
  static ireplace(options, data) {
    // eslint-disable-next-line no-restricted-syntax
    for (const values in options) {
      data = data.replace(new RegExp(values, 'gi'), options[values]);
    }
    return data;
  }

  /**
   * validate Users Signup
   * @param {object} options
   * @param {object} response
   * @returns boolean
   */
  static userProfile(options, response) {
    const {
      name, email, phone, password
    } = options;
    if (!validator.isEmail(email || '<>')) {
      return responseController.response({
        status: 400,
        message: 'empty or incorrect email'
      }, null, response);
    }
    if (!validator.isNumeric(phone || '<>')) {
      return responseController.response({
        status: 400,
        message: 'empty or incorrect phone'
      }, null, response);
    }
    if (!validate.isName(name || '<>')) {
      return responseController.response({
        status: 400,
        message: 'empty or incorrect name'
      }, null, response);
    }
    if (!validator.isEmpty(password)) {
      return responseController.response({
        status: 400,
        message: 'password should not be less than 8 characters'
      }, null, response);
    }
    return false;
  }

  /**
   *
   * @param {*} string
   * @returns string
   */
  static toString(string) {
    return (`${string}`);
  }

  /**
   * @description check if string is url
   * @originalAauthor Diogo Cardoso
   *https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
   * @edited Emmanuel Daniel <@emmsdan>, Made it es6 compactable.
   * @param {string} str
   * @returns boolean
   */
  static isURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?'
  + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'
  + '((\\d{1,3}\\.){3}\\d{1,3}))'
  + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'
  + '(\\?[;&a-z\\d%_.~+=-]*)?'
  + '(\\#[-a-z\\d_]*)?$', 'i');
    return pattern.test(str);
  }
}
module.exports = validate;
