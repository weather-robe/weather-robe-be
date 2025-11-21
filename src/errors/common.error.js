export class InvalidRequestError extends Error {
  errorCode = "invalid_request";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
    this.statusCode = 400;
  }
}

export class NotFoundError extends Error {
  errorCode = "not_found";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
    this.statusCode = 404;
  }
}
