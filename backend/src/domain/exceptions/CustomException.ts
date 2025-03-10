export class CustomException extends Error {
  public readonly code: string;
  public readonly message: string;
  public readonly status: number;
  public readonly errors?: any[];
  
  constructor(message: string, code: string = 'CUSTOM_ERROR', status: number = 400, errors?: any[]) {
    super(message);
    this.name = 'CustomException';
    this.code = code;
    this.message = message;
    this.status = status;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
