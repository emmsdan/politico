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
   * @description create an account for users.
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
            status: 201,
            message: resp
          }, response);
        }
        console.log (resp)
        return responseController.response({
          status: 404,
          message: 'no political office in database'
        }, null, response);
      })
      .catch((error) => {
        let errorResponse = `Error: ${error.message}`;
        return errorResponse ? responseController.response({ status: 432, message: errorResponse }, null, response) : '';
      });
  }
}
