export class NewOrderTemp {
    id: number;
    workDate: Date;
    zipCode: string;
    needVehicle: boolean;
    address: string;

    constructor(id: number,
                workDate: Date,
                zipCode: string,
                needVehicle: boolean,
                address: string) {
        this.id = id;
        this.workDate = workDate;
        this.zipCode = zipCode;
        this.needVehicle = needVehicle;
        this.address = address;
    }
}
