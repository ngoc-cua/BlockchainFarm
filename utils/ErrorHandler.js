class ResponseHandler {
  static success(res, message, data) {
    res.status(200).json({
      status: 'success',
      message,
      data
    });
  }

  static created(res, message, data) {
    res.status(201).json({
      status: 'success',
      message,
      data
    });
  }

  static badRequest(res, message) {
    res.status(400).json({
      status: 'error',
      message
    });
  }

  static unauthorized(res, message) {
    res.status(401).json({
      status: 'error',
      message
    });
  }

  static notFound(res, message) {
    res.status(404).json({
      status: 'error',
      message
    });
  }

  static serverError(res, message) {
    res.status(500).json({
      status: 'error',
      message
    });
  }
}

module.exports = ResponseHandler;
