export class Token {
  clientId: number;
  errorMessage: string;
  isValid: boolean;
  token: string;
  constructor(
    clientId: number,
    errorMessage: string,
    isValid: boolean,
    token: string
  ) {
    this.clientId = clientId;
    this.errorMessage = errorMessage;
    this.isValid = isValid;
    this.token = token;
  }
}
