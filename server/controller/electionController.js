import validate from '../helper/validate';
import Database from '../model/Database';
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
    const {
 userid, officeid, comment, evidenceUrl
} = request.body;
    if (!validate.isInt(userid) || !validate.isInt(officeid) || !validate.isAddress(comment) || !validate.isURL(evidenceUrl)) {
      return responseController.response({
        status: 422,
        message: 'invalid credencials. all fields are needed'
      }, null, response);
    }
    const petitionid = new Date().getTime();
    const fields = {
 petitionid, createdBy: userid, officeid, body: comment, evidence: evidenceUrl
};
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

  /**
  * @description register user as a candidate
  * @since v1.0.0
  * @param {object} request
  * @param {object} response
  * @returns promise
  */
  static registerCandidate(request, response) {
    const { userid, officeid, partyid } = request.body;
    if (!validate.isInt(userid) || !validate.isInt(officeid) || !validate.isInt(partyid)) {
      return responseController.response({
        status: 422,
        message: 'invalid credencials. all fields are needed'
      }, null, response);
    }
    const fields = { candidateid: userid, partyid, officeid };
    return Election.newCandidate(fields)
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
        if (error.message.includes('userid')) errorResponse = ' user id';
        if (error.message.includes('officeid')) errorResponse = ' office id';
        if (error.message.includes('partyid')) errorResponse = ' party id';
        if (error.message.includes('violates foreign')) errorResponse += 'does not exist';

        if (error.message.includes('violates unique')) errorResponse = 'already exist';
        return errorResponse ? responseController.response({ status: 432, message: errorResponse }, null, response) : '';
      });
  }

  /**
    * @description register user as a candidate
    * @since v1.0.0
    * @param {object} request
    * @param {object} response
    * @returns promise
    */
  static vote(request, response) {
    const { voter, office } = request.body;
    if (!validate.isInt(voter) || !validate.isInt(office)) {
      return responseController.response({
        status: 422,
        message: 'invalid credencials'
      }, null, response);
    }
    return Database.find('votes', {
      voter, office
    }).then((resp) => {
      if (!Array.isArray(resp)) {
        return Election.newVote({ voter, office })
          .then((res) => {
            if (res.rowCount > 0) {
              responseController.response(null, {
                status: 201,
                message: { voter, office }
              }, response);
            }
          })
          .catch((error) => {
            const errorResponse = `Error: ${error.message}`;
            return errorResponse ? responseController.response({ status: 432, message: errorResponse }, null, response) : '';
          });
      }
      throw Error('can\'t vote twice for the same office');
    }).catch((error) => {
      const errorResponse = `Error: ${error.message}`;
      return errorResponse ? responseController.response({ status: 432, message: errorResponse }, null, response) : '';
    });
  }
}
