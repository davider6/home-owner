export class Contractors {
    occupationsId: number[];
    zipCode: string;
    hasVehicle: boolean;

    constructor(occupationsId: number[],
        zipCode: string,
                hasVehicle: boolean) {
      this.occupationsId = occupationsId;
      this.zipCode = zipCode;
      this.hasVehicle = hasVehicle;
    }

  }