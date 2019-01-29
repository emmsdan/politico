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
    return (/^[a-zAZ0-9,.-\s]+$/i.test(address));
  }

  /**
	 * @description allow only alphabets and spaces
	 * @param {string} name
	 * @returns boolean
	 */
  static isName(name) {
    return (/^[A-Za-z\s]+$/.test(name));
  }
}

export default validate;
