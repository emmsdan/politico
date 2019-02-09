/* eslint-disable no-restricted-syntax */
import jwt from 'jsonwebtoken';

/**
 * @author Emmauel Daniel <@emmsdan>
 * 2239062
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
      'offices',
      'office'
    ];
  }

  /**
   * @description verify incoming url.
   * @param {object} request
   * @returns boolean
   */
  static verifyURL(request) {
    let pages = null;
    const { stack } = request.route;
    if (stack[0].method !== 'get') {
      jwtAuthentication.strictedPage().forEach((page) => {
        if (pages !== null) {
          return true;
        }
        pages = (request.originalUrl.split('/').includes(page)) ? page : null;
      });
      return pages || false;
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
  static generate(payload) {
    return jwt.sign({
      exp: Math.floor(Date.now() / 1000) + ((60 * 60) * 24 * 7), payload
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
  static generateWithHeader(payload, response) {
    const token = jwtAuthentication.generate(payload);
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
   */
  static authentication(request, response, next) {
    const token = jwtAuthentication.verify(request.headers.token || request.headers['x-access-token']);
    jwtAuthentication.setHeaders(response);
    try {
      if ((jwtAuthentication.verifyURL(request) && !token.payload.isAdmin) || !token) {
        response.status(401)
          .json({ error: 'Unauthorized, Please Login', status: 401 });
        response.end();
        return;
      }
    } catch (err) {
      response.status(401)
        .json({ error: 'Unauthorized', status: 401 });
      response.end();
      return;
    }
    next();
  }

  /**
   *
   * @param {object} response
   */
  static setHeaders(response) {
    response.setHeader('API-Author', 'Emmanuel Daniel. <@emmsdan>');
    response.setHeader('App-Client', 'Andela 21, (Jan 2019)');
  }
}
