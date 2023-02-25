export class Clients {
    id: number;
    fullName: string;
    address: string;
    email: string;
    status: boolean;
    zipCode: string;
    longitude: number;
    latitude: number;
    clientPassword: string;
    type: string;
    externalId: string;

    constructor(id: number,
                fullName: string,
                address: string,
                email: string,
                status: boolean,
                zipCode: string,
                longitude: number,
                latitude: number,
                clientPassword: string,
                type: string,
                externalId: null) {
      this.id = id;
      this.fullName = fullName;
      this.address = address;
      this.email = email;
      this.status = status;
      this.zipCode = zipCode;
      this.longitude = longitude;
      this.latitude = latitude;
      this.clientPassword = clientPassword;
      this.type = type;
      this.externalId = externalId;
    }

  }
