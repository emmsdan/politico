import validate from '../helper/validate';
import Party from '../model/Party';
import responseController from './responseController';

/**
 * @author Emmanuel Daniel <@emmsdan>
 * @version 1.0.0
 * @description handles user authentication
 */
export default class partyController {
  /**
  * @description create a political party
  * @since v1.0.0
  * @param {object} request
  * @param {object} response
  * @returns promise
  */
  static create(request, response) {
    const { hqAddress, name, logoUrl } = request.body;
    if (!validate.isName(name) || !validate.isAddress(hqAddress) || !validate.isURL(logoUrl)) {
      return responseController.response({
        status: 422,
        message: 'invalid credencials. all fields are needed'
      }, null, response);
    }
    const partyid = new Date().getTime();
    const fields = { partyid, name, hqAddress, logoUrl };
    return Party.create(fields)
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
        if (error.message.includes('name')) errorResponse = 'Party already exist';
        return errorResponse ? responseController.response({ status: 432, message: errorResponse }, null, response) : '';
      });
  }
}
