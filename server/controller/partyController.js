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
    const hqAddress = validate.trim(request.body.hqAddress.trim());
    const name = validate.trim(request.body.name.trim());
    const logoUrl = validate.trim(request.body.logoUrl.trim());

    if (!validate.isName(name.trim())) {
      return responseController.response({
        status: 400,
        message: 'empty or incorrect name format'
      }, null, response);
    }
    if (!validate.isAddress(hqAddress.trim())) {
      return responseController.response({
        status: 400,
        message: 'empty or  incorrect hqAddress format'
      }, null, response);
    }
    if (!logoUrl.trim()) {
      return responseController.response({
        status: 400,
        message: 'empty or  incorrect logo format'
      }, null, response);
    }
    const fields = { name, hqAddress, logoUrl };
    return Party.create(fields)
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
        if (error.message.includes('name')) errorResponse = 'Party already exist';
        return errorResponse ? responseController.response({ status: 400, message: errorResponse }, null, response) : '';
      });
  }

  /**
   * @description get all government parties
   * @since v1.0.0
   * @param {object} request
   * @param {object} response
   *
   * @returns object
   */
  static getAll(request, response) {
    return Party.viewAll()
      .then((resp) => {
        if (Array.isArray(resp)) {
          return responseController.response(null, {
            status: 200,
            message: resp
          }, response);
        }
        return responseController.response({
          status: 404,
          message: 'no political party in database'
        }, null, response);
      })
      .catch((error) => {
        const errorResponse = `Error: ${error.message}`;
        return errorResponse ? responseController.response({ status: 400, message: errorResponse }, null, response) : '';
      });
  }

  /**
   * @description view specific party.
   * @since v1.0.0
   * @param {object} request
   * @param {object} response
   *
   * @returns object
   */
  static get(request, response) {
    try {
      if (!validate.isInt(request.params.partyID)) {
        return responseController.response({
          status: 400,
          message: 'incorrect party id format'
        }, null, response);
      }
      return Party.get(request.params.partyID)
        .then((resp) => {
          if (Array.isArray(resp)) {
            return responseController.response(null, {
              status: 200,
              message: resp
            }, response);
          }
          return responseController.response({
            status: 404,
            message: 'no registered political party with such ID'
          }, null, response);
        })
        .catch((error) => {
          const errorResponse = `Error: ${error.message}`;
          return responseController.response({
            status: 400,
            message: errorResponse
          }, null, response);
        });
    } catch (error) {
      responseController.response({ status: 400, message: error.message }, null, response);
    }
  }

  /**
   * @description rename specific party.
   * @since v1.0.0
   * @param {object} request
   * @param {object} response
   *
   * @returns object
   */
  static edit(request, response) {
    try {
      if (!validate.isInt(request.params.partyID)) {
        return responseController.response({
          status: 400,
          message: 'incorrect party id'
        }, null, response);
      }
      if (!validate.isName(request.body.name)) {
        return responseController.response({
          status: 400,
          message: 'incorrect name format'
        }, null, response);
      }
      return Party.edit(request.body.name, request.params.partyID)
        .then((resp) => {
          if (resp === 'updated') {
            return responseController.response(null, {
              status: 200,
              message: { id: request.params.partyID, name: request.body.name }
            }, response);
          }
          return responseController.response({
            status: 404,
            message: 'no registered political party with such ID'
          }, null, response);
        })
        .catch((error) => {
          let errorResponse = `Error: ${error.message}`;
          if (error.message.includes('name')) errorResponse = 'A Party with this name already exist';
          return responseController.response({
            status: 412,
            message: errorResponse
          }, null, response);
        });
    } catch (error) {
      responseController.response({ status: 400, message: error.message }, null, response);
    }
  }

  /**
   * @description delete specific parties.
   * @since v1.0.0
   * @param {object} request
   * @param {object} response
   *
   * @returns object
   */
  static deleteParties(request, response) {
    try {
      if (!validate.isInt(request.params.partyID)) {
        return responseController.response({
          status: 400,
          message: 'incorrect party id format'
        }, null, response);
      }
      return Party.delete(request.params.partyID)
        .then((resp) => {
          if (resp === 'deleted') {
            return responseController.response(null, {
              status: 200,
              message: 'party deleted from record.'
            }, response);
          }
          return responseController.response({
            status: 404,
            message: 'no registered political party with such ID'
          }, null, response);
        })
        .catch(error => responseController.response({ status: 400, message: `Error: ${error.message}` }, null, response));
    } catch (error) {
      responseController.response({ status: 400, message: error.message }, null, response);
    }
  }
}
