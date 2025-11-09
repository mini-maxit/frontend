export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS'
}
export enum RequestContentType {
  Json = 'application/json',
  FormURLEncoded = 'application/x-www-form-urlencoded',
  MultipartFormData = 'multipart/form-data'
}

export interface Request {
  url: string;
  method: RequestMethod;
  body?: BodyInit;
  contentType?: RequestContentType;
  options?: RequestInit;
}
