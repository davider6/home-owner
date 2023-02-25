export class AcceptRejectDateRequestDTO {

    acceptChange: boolean;
    workOrderId: number;
    workerId: number;
    occupationId: number;

    constructor(acceptChange: boolean,
        workOrderId: number,
        workerId: number,
        occupationId: number) {
            this.acceptChange = acceptChange;
            this.workOrderId = workOrderId;
            this.workerId = workerId;
            this.occupationId = occupationId;
    }
}