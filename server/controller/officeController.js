import validate from '../helper/validate';
import Office from '../model/Office';
import responseController from './responseController';

/**
 * @author Emmanuel Daniel <@emmsdan>
 * @version 1.0.0
 * @description handles user authentication
 */
export default class officeController {
  /**
   * @description view specific office.
   * @since v1.0.0
   * @param {object} request
   * @param {object} response
   *
   * @returns object
   */
  static get(request, response) {
    try {
      if (!validate.isInt(request.params.officeID)) {
        return responseController.response({
          status: 400,
          message: 'incorrect office id format'
        }, null, response);
      }
      return Office.get(request.params.officeID)
        .then((resp) => {
          if (Array.isArray(resp)) {
            return responseController.response(null, {
              status: 200,
              message: resp
            }, response);
          }
          return responseController.response({
            status: 404,
            message: 'no registered political office with such ID'
          }, null, response);
        })
        .catch((error) => {
          const errorResponse = `Error: ${error.message}`;
          return responseController.response({
            status: 406,
            message: errorResponse
          }, null, response);
        });
    } catch (error) {
      responseController.response({ status: 406, message: error.message }, null, response);
    }
  }

  /**
  * @description create an account for users.
  * @since v1.0.0
  * @param {object} request
  * @param {object} response
  * @returns promise
  */
  static create(request, response) {
    const { type, name } = request.body;
    if (!validate.isName(name)) {
      return responseController.response({
        status: 400,
        message: 'incorrect name format'
      }, null, response);
    }
    if (!validate.isName(type)) {
      return responseController.response({
        status: 400,
        message: 'incorrect office type format'
      }, null, response);
    }
    const fields = { name, type };
    return Office.create(fields)
      .then((resp) => {
        if (resp.rowCount > 0) {
          responseController.response(null, {
            status: 201,
            message: resp.rows[0]
          }, response);
        }
      })
      .catch((error) => {
        let errorResponse = `Error: ${error.message}`;
        if (error.message.includes('name')) errorResponse = 'office already exist';
        return errorResponse ? responseController.response({ status: 400, message: errorResponse }, null, response) : '';
      });
  }

  /**
   * @description get all government offices
   * @since v1.0.0
   * @param {object} request
   * @param {object} response
   *
   * @returns object
   */
  static getAll(request, response) {
    return Office.viewAll()
      .then((resp) => {
        if (Array.isArray(resp)) {
          return responseController.response(null, {
            status: 200,
            message: resp
          }, response);
        }
        return responseController.response({
          status: 404,
          message: 'no political office in database'
        }, null, response);
      })
      .catch((error) => {
        const errorResponse = `Error: ${error.message}`;
        return errorResponse ? responseController.response({ status: 400, message: errorResponse }, null, response) : '';
      });
  }
}
