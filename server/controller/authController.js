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
   * @description create an account for users.
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
        status: 422,
        message: 'invalid credentials, specify an email or phone number'
      }, null, response);
    }
    const hashedPass = authController.hashPassword(password);
    const options = { phone: username };
    if (validator.isEmail(username)) {
      options.email = username;
      delete options.phone;
    }
    return User.login(options)
      .then((resp) => {
        if (!Array.isArray(resp) || resp[0].password !== hashedPass) {
          throw Error('username/password combination does not match');
        }
        const generatedToken = jwtToken.generateWithHeader({ email: resp[0].email, role: resp[0].role || 'user', userid: resp[0].userid }, response);
        return responseController.response(null, {
          status: 201,
          message: {
            token: generatedToken,
            user: {
              email: resp[0].email, phone: resp[0].phone, name: resp[0].name, userid: resp[0].userid
            },
            message: 'logged in successfully' }
        }, response);
      })
      .catch((error) => {
        let errorResponse = `Error: ${error.message}`;
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
