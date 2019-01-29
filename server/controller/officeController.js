import validator from 'validator';
import validate from '../helper/validate';
import responseController from './responseController';

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
    const { name, officeType, logoUrl } = req.body;
    try {
      if (!validate.isAddress(officeType) || !officeType || !validate.isName(name) || !name) {
        return responseController.response({
          status: 406,
          message: 'please check input'
        }, null, res);
      }
      if (this.officeExist(name)) {
        return responseController.response({
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
      return responseController.response(null, {
        status: 201,
        message: newoffice
      }, res);
    } catch (error) {
      return responseController.response({
        status: error.code || 404,
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
      return responseController.response(null, {
        status: 200,
        message: this.database
      }, res);
    }
    return responseController.response({
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
      return responseController.response({
        status: 404,
        message: 'please provide a valid office id'
      }, null, res);
    }

    const thisoffice = this.database.find(office => office.officeId === Number(id));
    if (!thisoffice) {
      return responseController.response({
        status: 404,
        message: 'no registered office with such ID'
      }, null, res);
    }
    return responseController.response(null, {
      status: 200,
      message: thisoffice
    }, res);
  }

  /**
   * @description check if office exist
   * @param {string} name
   * @returns boolean
   */
  officeExist(name) {
    const offices = this.database.find(office => office.name === name);
    if (offices) return true;
    return false;
  }
}
