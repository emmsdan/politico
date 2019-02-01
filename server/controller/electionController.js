import validate from '../helper/validate';
import Election from '../model/Election';
import responseController from './responseController';

/**
 * @author Emmanuel Daniel <@emmsdan>
 * @version 1.0.0
 * @description handles user authentication
 */
export default class electionController {
  /**
  * @description create an account for users.
  * @since v1.0.0
  * @param {object} request
  * @param {object} response
  * @returns promise
  */
  static filePetition(request, response) {
    const { userid, officeid, comment, evidenceUrl } = request.body;
    if (!validate.isInt(userid) || !validate.isInt(officeid) || !validate.isAddress(comment) || !validate.isURL(evidenceUrl)) {
      return responseController.response({
        status: 422,
        message: 'invalid credencials. all fields are needed'
      }, null, response);
    }
    const petitionid = new Date().getTime();
    const fields = { petitionid, createdBy: userid, officeid, body: comment, evidence: evidenceUrl  };
    return Election.createPetition(fields)
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
        if (error.message.includes('violates foreign key')) errorResponse = 'office/user id does not exist';
        return errorResponse ? responseController.response({ status: 432, message: errorResponse }, null, response) : '';
      });
  }
}
