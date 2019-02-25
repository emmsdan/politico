import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwtToken from '../middleware/jwt-authenitcate';
import validate from '../helper/validate';
import User from '../model/User';
import emailController from './emailController';
import responseController from './responseController';

/**
 * @author Emmanuel Daniel <@emmsdan>
 * @version 1.0.0
 * @description handles user authentication
 */
export default class authController {
  /**
   *
   * @param {string} password
   * @returns string
   */
  static hashPassword(password) {
    return bcrypt.hashSync(password, 12);
  }

  /**
   * @description create an account for users.
   * @since v1.0.0
   * @param {object} request
   * @param {object} response
   *
   * @returns object
   */
  static register(request, response) {
    const {
      firstName, lastName, otherName, email, phoneNumber, password, role
    } = request.body;
    if (validate.userProfile(request.body, response)) return;
    const hashedPass = authController.hashPassword(password);
    return User.register({
      firstName, lastName, otherName, email, phoneNumber, password: hashedPass, role: role || 'user'
    })
      .then((resp) => {
        const generatedToken = jwtToken.generateWithHeader({
          email, role: role || 'user', id: resp.rows[0].id, isAdmin: false
        }, response);
        if (process.env.NODE_ENV !== 'test') {
          authController.sendMail({
            name: firstName, email, phone: phoneNumber, signup: 'true', resp
          });
        }
        return responseController.response(null, {
          status: 201,
          message: {
            token: generatedToken,
            user: {
              id: resp.rows[0].id,
              firstName: resp.rows[0].firstname,
              lastName: resp.rows[0].lastname,
              otherName: resp.rows[0].othername === 'undefined' ? '' : resp.rows[0].othername,
              email: resp.rows[0].email,
              passportUrl: resp.rows[0].passporturl,
              phoneNumber: Number(resp.rows[0].phonenumber),
              isAdmin: resp.rows[0].isadmin
            },
            message: 'account created, an email as been sent containin your login details '
          }
        }, response);
      })
      .catch((error) => {
        let errorResponse = error.message;
        if (error.message.includes('email')) errorResponse = 'email already exist';
        if (error.message.includes('phone')) errorResponse = 'phone already exist';
        return errorResponse ? responseController.response({ status: 400, message: errorResponse }, null, response) : 'other errors';
      });
  }


  /**
   * @description get reset password link users.
   * @since v1.0.0
   * @param {object} request
   * @param {object} response
   *
   * @returns object
   */
  static setPasswordLink(request, response) {
    if (!validator.isEmail(request.body.email || '<>')) {
      responseController.response({
        status: 400,
        message: 'incorrect email format'
      }, null, response);
    }
    return User.findUser({ email: request.body.email })
      .then((resp) => {
        if (!Array.isArray(resp)) {
          throw Error('no user with such email');
        }
        if (process.env.NODE_ENV !== 'test') {
          authController.sendMail({
            name: resp[0].firstname, email: resp[0].email, type: 'reset', message: 'Use the link below to reset password', resetURL: bcrypt.hashSync(new Date().toLocaleDateString(), 2)
          });
        }
        return responseController.response(null, {
          status: 200,
          message: {
            message: 'check your email for password reset link',
            email: resp[0].email
          }
        }, response);
      })
      .catch((error) => {
        const errorResponse = error.message;
        return errorResponse ? responseController.response({ status: 400, message: errorResponse }, null, response) : 'other errors';
      });
  }

  /**
   * @description users can login to account.
   * @since v1.0.0
   * @param {object} request
   * @param {object} response
   *
   * @returns object
   */
  static login(request, response) {
    const { username, password } = request.body;
    if (!validator.isEmail(username || '<>') && !validator.isNumeric(username || '<>')) {
      return responseController.response({
        status: 400,
        message: 'no email or phone number.'
      }, null, response);
    }
    const options = { phoneNumber: username };
    if (validator.isEmail(username)) {
      options.email = username;
      delete options.phoneNumber;
    }
    return User.login(options)
      .then((resp) => {
        if (!Array.isArray(resp) || !bcrypt.compareSync(password, resp[0].password)) {
          throw Error('username and password combination does not match');
        }
        const generatedToken = jwtToken.generate({
          email: resp[0].email, role: resp[0].role, id: resp[0].id, isAdmin: resp[0].isadmin
        }, response);
        return responseController.response(null, {
          status: 200,
          message: {
            token: generatedToken,
            user: {
              id: resp[0].id,
              firstName: resp[0].firstname,
              lastName: resp[0].lastname,
              otherName: resp[0].othername === 'undefined' ? '' : resp[0].othername,
              email: resp[0].email,
              passportUrl: resp[0].passporturl,
              phoneNumber: resp[0].phonenumber,
              isAdmin: resp[0].isadmin
            },
            message: 'logged in successfully'
          }
        }, response);
      })
      .catch((error) => {
        const errorResponse = error.message;
        return errorResponse ? responseController.response({ status: 400, message: errorResponse }, null, response) : 'other errors';
      });
  }

  /**
   *
   * @param {*} request
   * @param {*} response
   * @return promise
   */
  static getUsers(request, response) {
    return User.getAll()
      .then((resp) => {
        if (Array.isArray(resp)) {
          return responseController.response(null, {
            status: 200,
            message: resp
          }, response);
        }
        return responseController.response({
          status: 404,
          message: 'no registered user found'
        }, null, response);
      })
      .catch((error) => {
        const errorResponse = error.message;
        return errorResponse ? responseController.response({ status: 400, message: errorResponse }, null, response) : '';
      });
  }

  /**
   *
   * @param {object} options
   */
  static sendMail(options) {
    const signup = options.signup || false;
    const {
      name, message, email, phone
    } = options;
    emailController.sendGrid({
      type: options.type || 'signup',
      resetURL: options.resetURL || 'NONAME',
      to: email,
      from: 'noreply@politicoandela21.com',
      message: `Hi, ${name}, <br/>  ${signup ? 'You account with Politico.io has been  created. here are your login details' : message} <br/>
      ${signup ? `
      <ul style="list-style: none">
        <li><strong>Email: ${email} </li>     <li><strong>Phone: ${phone} </li>
      </ui> ` : ''}`,
      subject: signup ? 'Welcome to Politico: - Registration Succesful' : options.subject || 'Reset your politico password'
    });
  }
}
