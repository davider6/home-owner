export class Authenticate {
    clientId: number;
    token: string;
    isValid: boolean;
    errorMessage: string;

    constructor(clientId: number,
                token: string,
                isValid: boolean,
                errorMessage: string) {
      this.clientId = clientId;
      this.token = token;
      this.isValid = isValid;
      this.errorMessage = errorMessage;
    }
}
