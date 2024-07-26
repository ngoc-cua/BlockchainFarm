

class ResponseHandler {
  static success(res, message, data) {
    return res.status(200).json({
      status: 'success',
      message,
      data
    });
  }

  static error(res, message, error) {
    return res.status(500).json({
      status: 'error',
      message,
      error: error.message || error
    });
  }
}

module.exports = ResponseHandler;
