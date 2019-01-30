import validator from 'validator';
import validate from '../helper/validate';
import responseController from './responseController';
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
   *
   * @param {va} fields
   * @param {*} response
   * @returns object;
   */
  validatePartyField(fields, response) {
    const { name, address } = fields;
    if (!validate.isAddress(address) || !validate.isName(name) || !name) {
      return responseController.response({
        status: 422,
        message: 'invalid credentials'
      }, null, response);
    }
    if (this.partyExist(name)) {
      return responseController.response({
        status: 409,
        message: 'a party with this name already exist'
      }, null, response);
    }
  }

  /**
   * create party
   * @param {*} req
   * @param {*} res
   * @returns object;
   */
  create(req, res) {
    const { name, logoUrl, address } = req.body;
    try {
      if (this.validatePartyField(req.body, res)) return;

      const newParty = {
        partyId: new Date().getTime(),
        name,
        address,
        logoUrl,
        createdOn: new Date().getTime(),
        updatedOn: new Date().getTime()
      };
      this.database.push(newParty);
      return responseController.response(null, {
        status: 201,
        message: newParty
      }, res);
    } catch (error) {
      return responseController.response({
        status: error.code || 503,
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
    const { name } = req.body;
    if (!id || !validator.isInt(id)) {
      return responseController.response({
        status: 404,
        message: 'no registered party with such ID'
      }, null, res);
    }
    if (!name || !validate.isName(name)) {
      return responseController.response({
        status: 422,
        message: 'invalid name, supplied'
      }, null, res);
    }
    const parties = this.database.filter(party => party.partyId !== Number(id));
    const thisParty = this.database.find(party => party.partyId === Number(id));
    if (!thisParty) {
      return responseController.response({
        status: 404,
        message: 'no registered party with such ID'
      }, null, res);
    }

    thisParty.name = name;
    thisParty.updatedOn = new Date().getTime();
    parties.push(thisParty);
    this.database = parties;
    return responseController.response(null, {
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
      return responseController.response(null, {
        status: 200,
        message: this.database
      }, res);
    }
    return responseController.response({
      status: 404,
      message: 'no registered political party'
    }, null, res);
  }

  /**
   * get a specific political party
   * @param {*} req
   * @param {*} res
   * @returns object;
   */
  get(req, res) {
    const id = req.params.partID;
    if (!id || !validator.isInt(id)) {
      return responseController.response({
        status: 404,
        message: 'please provide a valid party id'
      }, null, res);
    }

    const thisParty = this.database.find(p => p.partyId === Number(id));
    if (!thisParty) {
      return responseController.response({
        status: 404,
        message: 'no registered party with such ID'
      }, null, res);
    }
    return responseController.response(null, {
      status: 200,
      message: thisParty
    }, res);
  }

  /**
   * delete a political pearties
   * @param {*} req
   * @param {*} res
   * @returns object;
   */
  deleteParties(req, res) {
    const id = req.params.partID;
    if (!validator.isInt(id) || !id) {
      return responseController.response({
        status: 404,
        message: 'specify a valid party id.'
      }, null, res);
    }

    const party = this.database.filter(p => p.partyId !== Number(id));
    if (party.length !== this.database.length) {
      this.database = party;
      return responseController.response(null, {
        status: 410,
        message: 'party delete successfully'
      }, res);
    }
    return responseController.response({
      status: 404,
      message: 'no registered party with such ID'
    }, null, res);
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
