import validator from 'validator';
import validate from '../helper/validate';

/**
 * partyController
 *
 */
export default class partyController {
  /**
   * partyController constructor
   * @param {*} database
   * */
  constructor(database = []) {
    this.database = database || [];
  }

  /**
   * create party
   * @param {*} req
   * @param {*} res
   * @returns object;
   */
  create(req, res) {
    const name = req.body.name || '<help>out';
    const address = req.body.address || '<help>out';
    const logoUrl = req.body.logoUrl;
    try {
      if (!validate.isAddress(address) || !validate.isName(name)) {
        return this.response({
          status: 406,
          message: 'please check input'
        }, null, res);
      }
      if (this.partyExist(name)) {
        return this.response({
          status: 404,
          message: 'part already exist'
        }, null, res);
      }
      const newParty = {
        partyId: new Date().getTime(),
        name,
        address,
        logoUrl,
        createdOn: new Date().getTime(),
        updatedOn: new Date().getTime()
      };
      this.database.push(newParty);
      return this.response(null, {
        status: 201,
        message: newParty
      }, res);
    } catch (error) {
      return this.response({
        status: error.code,
        data: error.message
      });
    }
  }

  /**
   * edit a specific political party
   * @param {*} req
   * @param {*} res
   * @returns object;
   */
  edit(req, res) {
    const id = req.params.partID;
    const name = req.body.name;
    if (!validator.isInt(id) || !id === '' || id === undefined) {
      return this.response({
        status: 404,
        message: 'please provide a valid party id'
      }, null, res);
    }
    if (!validate.isName(name) || !req.body.name) {
      return this.response({
        status: 404,
        message: 'invalid name, supplied'
      }, null, res);
    }
    const parties = this.database.filter(p => p.partyId !== Number(id));
    const thisParty = this.database.find(p => p.partyId === Number(id));
    if (!thisParty) {
      return this.response({
        status: 404,
        message: 'no party not found'
      }, null, res);
    }
    thisParty.name = name;
    thisParty.updatedOn = new Date().getTime();
    parties.push(thisParty);
    this.database = parties;
    return this.response(null, {
      status: 200,
      message: thisParty
    }, res);
  }

  /**
   * get all political party
   * @param {*} req
   * @param {*} res
   * @returns object;
   */
  getAll(req, res) {
    if (this.database.length >= 1) {
      return this.response(null, {
        status: 200,
        message: this.database
      }, res);
    }
    return this.response({
      status: 404,
      message: 'no registered political party'
    }, null, res);
  }

  /**
   * fetch specific political party
   * @param {*} req
   * @param {*} res
   * @returns object;
   */
  get(req, res) {
    const id = req.params.partID;
    if (!validator.isInt(id)) {
      return this.response({
        status: 404,
        message: 'please provide a valid party id'
      }, null, res);
    }
    const party = this.database.find(p => p.partyId === Number(id));
    if (!party) {
      return this.response({
        status: 404,
        message: 'the party you are looking for, does not exist'
      }, null, res);
    }
    return this.response(null, {
      status: 200,
      message: party
    }, res);
  }

  /**
   * @description handles response to view
   * @param {null/object} error
   * @param {null/object} success
   * @param {object} response
   * @returns object
   */
  response(error, success, response = this.response) {
    if (error === null) {
      return response.status(success.status).json({
        status: success.status,
        data: [success.message]
      });
    }
    return response.status(error.status).json({
      status: error.status,
      error: error.message
    });
  }

  /**
   * @description check if party exist
   * @param {string} name
   * @returns boolean
   */
  partyExist(name) {
    const party = this.database.find(p => p.name === name);
    if (party) return true;
    return false;
  }
}
