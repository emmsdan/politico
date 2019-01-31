import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwtToken from '../middleware/jwt-authenitcate';
import validator from 'validator';
import validate from '../helper/validate';
import User from '../model/User';
import emailController from './emailController';
import responseController from './responseController';
import { NONAME } from 'dns';

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
    return bcrypt.hashSync(password, process.env.cryptoKey);
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
      name, email, phone, password, role
    } = request.body;
    const userid = `${new Date().getTime()}`;
    if (validate.userProfile(request.body, response)) return;
    const hashedPass = authController.hashPassword(password);
    return User.register({
 name, email, phone, password: hashedPass, role: role || 'user', userid
})
      .then((resp) => {
        const generatedToken = jwtToken.generateWithHeader({ email, role: role || 'user', userid }, response);
        authController.sendMail({
 name, email, phone, signup: 'true'
});
        return responseController.response({
          status: 201, message: { token: generatedToken, user: {
 email, phone, name, userid
}, message: 'account created, an email as been sent containin your login details ' }
        }, null, response);
      })
      .catch((error) => {
        let errorResponse = `Error: ${error.message}`;
        if (error.message.includes('email')) errorResponse = 'email already exist';
        if (error.message.includes('phone')) errorResponse = 'phone already exist';
        return errorResponse ? responseController.response({ status: 432, message: errorResponse }, null, response) : 'other errors';
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
        status: 422,
        message: 'invalid credentials'
      }, null, response);
    }
    return User.findUser({ email: request.body.email })
      .then((resp) => {
        if (!Array.isArray(resp)) {
          throw Error('no user with such email');
        }
        authController.sendMail({ name: resp[0].name, email: resp[0].email, type: 'reset', message: 'Use the link below to reset password', resetURL: bcrypt.hashSync(new Date().toLocaleDateString(), 2) });
        return responseController.response(null, {
          status: 200, message: 'check email for password reset link'
        }, response);
      })
      .catch((error) => {
        const errorResponse = `Error: ${error.message}`;
        return errorResponse ? responseController.response({ status: 432, message: errorResponse }, null, response) : 'other errors';
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
      from: 'no-reply@andela21.com',
      message: `Hi, ${name}, <br/>  ${signup ? 'You account with Politico.io has been  created. here are your login details' : message} <br/>
      ${signup ? `
      <ul style="list-style: none">
        <li><strong>Email: ${email} </li>     <li><strong>Phone: ${phone} </li>
      </ui> ` : ''}`,
      subject: signup ? 'Welcome to Politico: - Registration Succesful' : options.subject || 'Reset your politico password'
    });
  }
}
