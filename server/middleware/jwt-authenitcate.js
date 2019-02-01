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
    const { stack } = request.route;
    if (stack[0].method !== 'get') {
      let pages = null;
      jwtAuthentication.strictedPage().forEach((page) => {
        pages = (request.originalUrl.split('/').includes(page)) ? page : null;
      });
      if (pages !== null) {
        return true;
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
  static generate(payload, expires = null) {
    return jwt.sign({
      exp: expires || Math.floor(Date.now() / 1000) + ((60 * 60) * 24 * 7), payload
    },
    process.env.PrivateKey);
  }

  /**
   * @description generate authentication token
   * and set cookie,
   * @expires default after 1 week
   * @param {object/string} payload
   * @param {string} expires
   * @returns string;
   */
  static generateWithHeader(payload, response, expires = null) {
    const token = jwt.sign({
      exp: expires || Math.floor(Date.now() / 1000) + ((60 * 60) * 24 * 7), payload
    }, process.env.PrivateKey);
    response.cookie(process.env.TOKEN_NAME, token, { maxAge: 900000, httpOnly: true });
    return token;
  }

  /**
   * @description decode generated authentication token
   * @param {object/string} token
   * @returns string;
   */
  static decode(token) {
    try {
      if (!token) return false;
      return jwt.decode(token.toString(), process.env.PrivateKey);
    } catch (err) {
      return false;
    }
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
   * @param {object} type
   * @return {object} object
   */
  static authenticationLoggedIn(request, response, next) {
    const token = jwtAuthentication.decode(request.cookies[process.env.TOKEN_NAME]);
    return jwtAuthentication.checkisAdmin('user', token, request, response, next);
  }

  /**
   * @description authenticate all urls
   * @param {object} request
   * @param {object} response
   * @param {object} next
   * @param {object} type
   * @return {object} object
   */
  static authenticationLoggedAdmin(request, response, next) {
    const token = jwtAuthentication.decode(request.cookies[process.env.TOKEN_NAME]);
    return jwtAuthentication.checkisAdmin('admin', token, request, response, next);
  }

  /**
   *
   * @param {*} type
   * @param {*} token
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  static checkisAdmin(type, token, request, response, next) {
    console.log (token, token.role !== type, jwtAuthentication.verifyURL(request));
    jwtAuthentication.setHeaders(response);
    if ((jwtAuthentication.verifyURL(request) &&  token.role !== type) || !token) {
      response.status(401)
        .json({ error: 'Unauthorized', status: 401 });
      response.end();
      return;
    }
    next();
  }

  /**
   *
   */
  static setHeaders(response) {
    response.setHeader('API-Author', 'Emmanuel Daniel. <@emmsdan>');
    response.setHeader('App-Client', 'Andela 21, (Jan 2019)');
  }
}
