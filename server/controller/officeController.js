import validator from 'validator';
import validate from '../helper/validate';

/**
 * officeController
 *
 */
export default class officeController {
  /**
   * officeController constructor
   * @param {*} database
   * */
  constructor(database = []) {
    this.database = database || [];
  }

  /**
   * create office
   * @param {*} req
   * @param {*} res
   * @returns object;
   */
  create(req, res) {
    console.log (req.body.officeType, req.body.name, 'z4ex5rc6t7vyb8un');
    const name = req.body.name || '<help>out';
    const officeType = req.body.officeType || '<help>out';
    const logoUrl = req.body.logoUrl || 'null';
    try {
      if (!validate.isAddress(officeType) || !officeType || !validate.isName(name) || !name) {
        return this.response({
          status: 406,
          message: 'please check input'
        }, null, res);
      }
      if (this.officeExist(name)) {
        return this.response({
          status: 406,
          message: 'office already exist'
        }, null, res);
      }
      const newoffice = {
        officeId: req.body.officeID || new Date().getTime(),
        name,
        type: officeType,
        logoUrl,
        createdOn: new Date().getTime(),
        updatedOn: new Date().getTime()
      };
      this.database.push(newoffice);
      return this.response(null, {
        status: 201,
        message: newoffice
      }, res);
    } catch (error) {
      return this.response({
        status: error.code,
        data: error.message
      });
    }
  }

  /**
   * get all government office
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
      message: 'no registered government office'
    }, null, res);
  }

  /**
   * get a specific government office
   * @param {*} req
   * @param {*} res
   * @returns object;
   */
  get(req, res) {
    const id = req.params.officeID;
    if (!id || !validator.isInt(id)) {
      return this.response({
        status: 404,
        message: 'please provide a valid office id'
      }, null, res);
    }

    const thisoffice = this.database.find(p => p.officeId === Number(id));
    if (!thisoffice) {
      return this.response({
        status: 404,
        message: 'no registered office with such ID'
      }, null, res);
    }
    return this.response(null, {
      status: 200,
      message: thisoffice
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
   * @description check if office exist
   * @param {string} name
   * @returns boolean
   */
  officeExist(name) {
    const office = this.database.find(p => p.name === name);
    if (office) return true;
    return false;
  }
}
