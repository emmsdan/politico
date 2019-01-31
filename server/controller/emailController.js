import fs from 'fs';
import sgMail from '@sendgrid/mail';
import validate from '../helper/validate';

/**
 * @author Emmanuel Daniel <@emmsdan>
 */
class EmailController {
  /**
   * @description connect to sendGrid API server.
   */
  static connectSGrid() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  /**
 * @description send email
 * @example   emailController.sendGrid({
    to: 'ecomje@gmail.com',//can be commer seperated
    from: '' [optional]
    message: ` `,
    subject: '',
    name: '' [optional]
  })
 * @param {object} options
 * @returns object
 */
  static async sendGrid(options) {
    EmailController.connectSGrid();
    const msg = {};
    msg.to = options.to;
    msg.from = options.from || 'ecomje@gmail.com';
    msg.subject = options.subject || 'Politico';
    msg.text = options.message;
    msg.html = EmailController.loadDefault({
      message: options.message,
      name: options.name || ''
    }, options.type || 'signup');

    try {
      const resp = await sgMail.send(msg);
      if (resp[0].statusCode === 202) {
        return 'email sent';
      }
      throw Error('server error');
    } catch (err) {
      return err;
    }
  }

  /**
   *
   * @param {*} options
   * @param {*} file
   * @returns object
   */
  static loadDefault(options, file) {
    return validate.ireplace({
      '{{ resetURl }}': options.resetURL || 'none',
      '{{ host_url }}': process.env.HOST_URL,
      '{{ message }}': options.message,
      '{{ github }}': process.env.github,
      '{{ facebook }}': process.env.fb,
      '{{ linkedin }}': process.env.linkedIn,
      '{{ twitter }}': process.env.twitter,
      '{{ name }}': options.name,
      '{{ host_title }}': process.env.host_name
    },
    fs.readFileSync(`${__dirname}\\..\\template\\${file}.pt`, 'utf8'));
  }
}

export default EmailController;
