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
      userid, officeid, comment, evidence
    } = request.body;
    if (!validate.isInt(userid)) {
      return responseController.response({
        status: 400,
        message: 'empty or incorrect user id'
      }, null, response);
    }
    if (!validate.isInt(officeid)) {
      return responseController.response({
        status: 400,
        message: 'empty or incorrect office id'
      }, null, response);
    }
    if (!validate.isAddress(comment)) {
      return responseController.response({
        status: 400,
        message: 'empty or incorrect body format'
      }, null, response);
    }
    if (!validate.isURL(evidence)) {
      return responseController.response({
        status: 400,
        message: 'empty or incorrect url format.'
      }, null, response);
    }
    const fields = {
      createdBy: userid, office: officeid, text: comment, evidence
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
    if (!validate.isInt(userid)) {
      return responseController.response({
        status: 400,
        message: 'empty or incorrect user id format'
      }, null, response);
    }
    if (!validate.isInt(officeid)) {
      return responseController.response({
        status: 400,
        message: 'empty or incorrect office id format'
      }, null, response);
    }
    if (!validate.isInt(partyid)) {
      return responseController.response({
        status: 400,
        message: 'empty or incorrect party id format'
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
        if (error.message.includes('partyid')) errorResponse += ' party id';
        if (error.message.includes('violates foreign')) errorResponse += 'does not exist';

        if (error.message.includes('violates unique')) errorResponse = 'already exist';
        return errorResponse ? responseController.response({ status: 400, message: errorResponse }, null, response) : '';
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
    const { voter, officeid, candidate } = request.body;
    if (!validate.isInt(voter) || !validate.isInt(officeid)) {
      return responseController.response({
        status: 400,
        message: 'empty or incorrect voter id or office id format'
      }, null, response);
    }
    return Database.find('votes', {
      voter, officeid
    }).then((resp) => {
      if (!Array.isArray(resp)) {
        return Election.newVote({ voter, officeid, candidate })
          .then((res) => {
            if (res.rowCount > 0) {
              responseController.response(null, {
                status: 201,
                message: { voter, officeid, candidate }
              }, response);
            }
          })
          .catch((error) => {
            let errorResponse = `Error: ${error.message}`;
            if (error.message.includes('violates foreign key')) errorResponse = 'office/candidate id does not exist';
            return errorResponse ? responseController.response({ status: 432, message: errorResponse }, null, response) : '';
          });
      }
      throw Error('can\'t vote twice for the same office');
    }).catch((error) => {
      const errorResponse = `Error: ${error.message}`;
      return errorResponse ? responseController.response({ status: 432, message: errorResponse }, null, response) : '';
    });
  }

  /**
   *
   * @param {*} request
   * @param {*} response
   * @return promise;
   */
  static getElectionResult(request, response) {
    return Election.electionResult()
      .then(resp => responseController.response(null, {
        status: 200,
        message: resp
      }, response))
      .catch(error => responseController.response({
        status: 404,
        message: error
      }, null, response));
  }

  /**
   *
   * @param {*} request
   * @param {*} response
   * @return promise;
   */
  static getOfficeResult(request, response) {
    if (!validate.isInt(request.params.officeId)) {
      return responseController.response({
        status: 400,
        message: 'incorrect office id format'
      }, null, response);
    }
    return Election.officeResult(request.params.officeId)
      .then((resp) => {
        if (resp === 'not found') throw Error('no eletion result found for this office');

        responseController.response(null, {
          status: 200,
          message: resp
        }, response);
      })
      .catch(error => responseController.response({
        status: 404,
        message: error.message
      }, null, response));
  }

  /**
  *
  * @param {*} request
  * @param {*} response
  * @return promise;
  */
  static getCandidates(request, response) {
    return Election.viewCandidates()
      .then(resp => responseController.response(null, {
        status: 200,
        message: resp
      }, response))
      .catch(error => responseController.response({
        status: 404,
        message: error
      }, null, response));
  }
}
