export class AuthError extends Error {
  errorCode = "unauthorized";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
    this.statusCode = 401;
  }
}

export class NotAccessTokenError extends Error {
  errorCode = "not_access_token";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
    this.statusCode = 403;
  }
}

export class NotRefreshTokenError extends Error {
  errorCode = "not_refresh_token";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
    this.statusCode = 403;
  }
}

export class DuplicateEmailError extends Error {
  errorCode = "duplicate_email";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
    this.statusCode = 409;
  }
}

export class DuplicateLoginIdError extends Error {
  errorCode = "duplicate_login_id";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
    this.statusCode = 409;
  }
}

export class ExpirationAccessTokenError extends Error {
  errorCode = "expired_access_token";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
    this.statusCode = 419;
  }
}
