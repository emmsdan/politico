/**
 * pass correct response to the router
 */
class responseController {
  /**
   * @description handles response to view
   * @param {null/object} error
   * @param {null/object} success
   * @param {object} response
   * @returns object
   */
  static response(error, success, response = this.response) {
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
}

export default responseController;
