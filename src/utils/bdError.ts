export enum HttpStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  ImUsed = 226,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  Unused = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  UriTooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,
}

export enum ErrorCode {
  DBError = 'DB_ERROR',
  AuthServiceError = 'AUTH_SERVICE_ERROR',
  ControllerError = 'CONTROLLER_ERROR',
  ExternalServiceError = 'EXTERNAL_SERVICE_ERROR',
  ValidationFailed = 'VALIDATION_FAILED',
  AWSError = 'AWS_ERROR',
  RefreshTokenExpired = 'REFRESH_TOKEN_ERROR',
  // Add more error codes as needed
}

const HttpStatusCodeErrorMessages: Record<HttpStatusCode, string> = {
  [HttpStatusCode.Continue]: 'Continue: Server expects further request data',
  [HttpStatusCode.SwitchingProtocols]:
    'Switching Protocols: Server is switching protocols',
  [HttpStatusCode.Processing]:
    'Processing: Server is still processing the request',
  [HttpStatusCode.EarlyHints]:
    'Early Hints: Server is providing early response hints',
  [HttpStatusCode.Ok]: 'OK: Request was successful',
  [HttpStatusCode.Created]: 'Created: Request has been successfully created',
  [HttpStatusCode.Accepted]:
    'Accepted: Request has been accepted for processing',
  [HttpStatusCode.NonAuthoritativeInformation]:
    'Non-Authoritative Information: Response is not from the original server',
  [HttpStatusCode.NoContent]:
    'No Content: Request has been successfully processed with no response data',
  [HttpStatusCode.ResetContent]:
    'Reset Content: Request content has been reset',
  [HttpStatusCode.PartialContent]:
    'Partial Content: Partial response has been returned',
  [HttpStatusCode.MultiStatus]: 'Multi-Status: Multiple status codes returned',
  [HttpStatusCode.AlreadyReported]:
    'Already Reported: Request has already been reported',
  [HttpStatusCode.ImUsed]: 'IM Used: Server is using the request',
  [HttpStatusCode.MultipleChoices]:
    'Multiple Choices: Multiple options available for the request',
  [HttpStatusCode.MovedPermanently]:
    'Moved Permanently: Resource has been permanently moved',
  [HttpStatusCode.Found]: 'Found: Resource has been found',
  [HttpStatusCode.SeeOther]:
    'See Other: Request should be redirected to another URL',
  [HttpStatusCode.NotModified]: 'Not Modified: Cached response is still valid',
  [HttpStatusCode.UseProxy]:
    'Use Proxy: Request should be made through a proxy',
  [HttpStatusCode.Unused]: 'Unused: Status code is reserved, but not used',
  [HttpStatusCode.TemporaryRedirect]:
    'Temporary Redirect: Request should be temporarily redirected to another URL',
  [HttpStatusCode.PermanentRedirect]:
    'Permanent Redirect: Request should be permanently redirected to another URL',
  [HttpStatusCode.BadRequest]:
    'Bad Request: Invalid request format or parameters',
  [HttpStatusCode.Unauthorized]:
    'Unauthorized: Authentication is required to access the resource',
  [HttpStatusCode.PaymentRequired]:
    'Payment Required: Payment is required to access the resource',
  [HttpStatusCode.Forbidden]: 'Forbidden: Access to the resource is forbidden',
  [HttpStatusCode.NotFound]: 'Not Found: Requested resource was not found',
  [HttpStatusCode.MethodNotAllowed]:
    'Method Not Allowed: HTTP method is not supported for the resource',
  [HttpStatusCode.NotAcceptable]:
    'Not Acceptable: Requested content format is not available',
  [HttpStatusCode.ProxyAuthenticationRequired]:
    'Proxy Authentication Required: Proxy authentication is required',
  [HttpStatusCode.RequestTimeout]:
    'Request Timeout: Server did not receive a complete request within the timeout period',
  [HttpStatusCode.Conflict]:
    'Conflict: Request conflicts with the current state of the resource',
  [HttpStatusCode.Gone]: 'Gone: Requested resource is no longer available',
  [HttpStatusCode.LengthRequired]:
    'Length Required: Content length is required for the request',
  [HttpStatusCode.PreconditionFailed]:
    'Precondition Failed: Precondition specified in the request headers failed',
  [HttpStatusCode.PayloadTooLarge]:
    "Payload Too Large: Request payload exceeds the server's limit",
  [HttpStatusCode.UriTooLong]:
    "URI Too Long: Request URI exceeds the server's limit",
  [HttpStatusCode.UnsupportedMediaType]:
    'Unsupported Media Type: Request media type is not supported',
  [HttpStatusCode.RangeNotSatisfiable]:
    'Range Not Satisfiable: Range specified in the request headers cannot be satisfied',
  [HttpStatusCode.ExpectationFailed]:
    'Expectation Failed: Server cannot meet the requirements specified in the Expect request header',
  [HttpStatusCode.ImATeapot]: "I'm a Teapot: Server is a teapot (RFC 2324)",
  [HttpStatusCode.MisdirectedRequest]:
    'Misdirected Request: Request was directed to a server that is not able to produce a response',
  [HttpStatusCode.UnprocessableEntity]:
    'Unprocessable Entity: Request cannot be processed due to semantic errors',
  [HttpStatusCode.Locked]:
    'Locked: Requested resource is locked and unavailable for modification',
  [HttpStatusCode.FailedDependency]:
    'Failed Dependency: Request failed due to a dependency failure',
  [HttpStatusCode.TooEarly]: 'Too Early: Request is too early to be processed',
  [HttpStatusCode.UpgradeRequired]:
    'Upgrade Required: Request requires an upgrade to a different protocol',
  [HttpStatusCode.PreconditionRequired]:
    'Precondition Required: Precondition is required for the request',
  [HttpStatusCode.TooManyRequests]:
    'Too Many Requests: Rate limit for the request has been exceeded',
  [HttpStatusCode.RequestHeaderFieldsTooLarge]:
    'Request Header Fields Too Large: Request headers are too large',
  [HttpStatusCode.UnavailableForLegalReasons]:
    'Unavailable For Legal Reasons: Requested resource is unavailable due to legal reasons',
  [HttpStatusCode.InternalServerError]:
    'Internal Server Error: Unexpected error occurred on the server',
  [HttpStatusCode.NotImplemented]:
    'Not Implemented: Requested functionality is not implemented on the server',
  [HttpStatusCode.BadGateway]:
    'Bad Gateway: Server received an invalid response from an upstream server',
  [HttpStatusCode.ServiceUnavailable]:
    'Service Unavailable: Server is temporarily unable to handle the request',
  [HttpStatusCode.GatewayTimeout]:
    'Gateway Timeout: Server did not receive a timely response from an upstream server',
  [HttpStatusCode.HttpVersionNotSupported]:
    'HTTP Version Not Supported: Server does not support the HTTP protocol version used in the request',
  [HttpStatusCode.VariantAlsoNegotiates]:
    'Variant Also Negotiates: Negotiation for the requested resource failed',
  [HttpStatusCode.InsufficientStorage]:
    'Insufficient Storage: Server has insufficient storage to complete the request',
  [HttpStatusCode.LoopDetected]:
    'Loop Detected: Server detected an infinite loop while processing the request',
  [HttpStatusCode.NotExtended]:
    'Not Extended: Further extensions to the request are required',
  [HttpStatusCode.NetworkAuthenticationRequired]:
    'Network Authentication Required: Network authentication is required to access the resource',
};

const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.DBError]: 'An error occurred in the database',
  [ErrorCode.AuthServiceError]:
    'An error occurred in the authentication service',
  [ErrorCode.ControllerError]: 'An error occurred in the controller',
  [ErrorCode.ExternalServiceError]: 'An error occurred in an external service',
  [ErrorCode.ValidationFailed]: 'Validation failed for the request',
  [ErrorCode.AWSError]: 'Request sent to AWS failed',
  [ErrorCode.RefreshTokenExpired]: 'Refresh Token Expired',
  // Add more error messages as needed
};

export class BDError extends Error {
  httpCode: HttpStatusCode;

  httpError: string;

  errorCode: ErrorCode;

  errorMessage: string;

  constructor(
    message: string,
    statusCode: HttpStatusCode,
    errorCode: ErrorCode,
  ) {
    super(message);
    this.httpCode = statusCode;
    this.httpError = HttpStatusCodeErrorMessages[statusCode];

    this.errorCode = errorCode;
    this.errorMessage = ErrorMessages[errorCode];
  }
}
