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

  static trim(string) {
    return string.replace(/^\s+|\s+$/gm, '');
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
   * @param {string} data
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
      firstName, lastName, otherName, email, phoneNumber, password, passportUrl
    } = options;
    if (!validator.isEmail(email || '<>') || email.toString().trim() < 3) {
      return responseController.response({
        status: 400,
        message: 'empty or incorrect email'
      }, null, response);
    }
    if (!validate.isInt(phoneNumber || '<>')) {
      return responseController.response({
        status: 400,
        message: 'empty or incorrect phone'
      }, null, response);
    }
    if (!validator.isAlpha(firstName || '<>') || !validator.isAlpha(lastName || '<>') || !validator.isAlpha(otherName || 'a')) {
      return responseController.response({
        status: 400,
        message: 'empty or incorrect name format.'
      }, null, response);
    }
    if (validator.isEmpty(password.toString().trim() || '') || password.length < 6) {
      return responseController.response({
        status: 400,
        message: 'password should not be less than 6 characters'
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
    return validate.isAddress(str);
  }

  /**
   *
   * @param {*} size
   * @returns string;
   */
  static generateChar(size) {
    let text = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < size; i += 1) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
  }

  /**
   *
   * @param {*} size
   * @returns string;
   */
  static generateNumber(size) {
    let text = '';
    const chars = '1234567890987654321';
    for (let i = 0; i < size; i += 1) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return Number(text);
  }

  /**
   *
   * @param {*} min
   * @param {*} max
   * @returns number
   */
  static randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  /**
  *
  * @param {*} array
  * @returns array
  */
  static randomElement(array) {
    return array[validate.randomNumber(0, array.length - 1)];
  }
}
module.exports = validate;
