/* eslint-disable no-restricted-syntax */
import jwt from 'jsonwebtoken';

/**
 * @author Emmauel Daniel <@emmsdan>
 */
export default class jwtAuthentication {
  /**
   * @description defines al protected route with the except
   * of routes gotten from GET METHOD.
   * @returns {array} array;
   */
  static strictedPage() {
    return [
      'parties',
      'offices'
    ];
  }

  /**
   * @description verify incoming url.
   * @param {object} request
   * @returns boolean
   */
  static verifyURL(request) {
    const { path, stack } = request.route;
    if (stack[0].method !== 'get') {
      let page = '';
      for (page of jwtAuthentication.strictedPage()) {
        if (path.split('/').contains(page)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * @description generate authentication token,
   * @expires default after 1 week
   * @param {object/string} payload
   * @param {string} expires
   * @returns string;
   */
  static generate(payload, expires = Math.floor(Date.now() / 1000) + ((60 * 60) * 24 * 7)) {
    return jwt.sign({ exp: expires, payload }, process.env.PrivateKey);
  }

  /**
   * @description decode generated authentication token
   * @param {object/string} token
   * @returns string;
   */
  static verify(token) {
    try {
      if (!token) return false;
      return jwt.verify(token.toString(), process.env.PrivateKey);
    } catch (err) {
      return false;
    }
  }

  /**
   * @description authenticate all urls
   * @param {object} request
   * @param {object} response
   * @param {object} next
   */
  static authenticationLoggedIn(request, response, next) {
    response.setHeader('API-Author', 'Emmanuel Daniel. <@emmsdan>');
    response.setHeader('App-Client', 'Andela 21, (Jan 2019)');
    const token = jwtAuthentication.verify(request.cookies['x-token']);
    if ((jwtAuthentication.verifyURL(request) && token.role !== 'admin')) {
      response.status(401)
        .json({ error: 'Unauthorized', status: 401 });
      response.end();
      return;
    }
    next();
  }
}
