import validate from '../helper/validate';
import Office from '../model/office';
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
          status: 404,
          message: 'please provide a valid political office id'
        }, null, response);
      }
      return Office.get(request.params.officeID)
        .then((resp) => {
          console.log(resp)
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
          console.log(error)
          let errorResponse = `Error: ${error.message}`;
          return responseController.response({ status: 432, message: errorResponse }, null, response);
        });
    } catch (error) {
      responseController.response({ status: 432, message: error.message }, null, response);
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
    const { type, name, logoUrl } = request.body;
    if (!validate.isName(name) || !validate.isName(type) || !validate.isURL(logoUrl)) {
      return responseController.response({
        status: 422,
        message: 'invalid credencials. all fields are needed'
      }, null, response);
    }
    const officeid = new Date().getTime();
    const fields = { officeid, name, type, logoUrl };
    return Office.create(fields)
      .then((resp) => {
        if (resp.rowCount > 0) {
          responseController.response(null, {
            status: 201,
            message: fields
          }, response);
        }
      })
      .catch((error) => {
        let errorResponse = `Error: ${error.message}`;
        if (error.message.includes('name')) errorResponse = 'office already exist';
        return errorResponse ? responseController.response({ status: 432, message: errorResponse }, null, response) : '';
      });
  }
}
