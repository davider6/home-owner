export class FinalizeOrderRequestDTO {
    
    workOrderId: number;
    workerId: number;
    occupationId: number;
    commentary: string;
    rate: number;

    constructor(workOrderId: number,
        workerId: number,
        occupationId: number,
        commentary: string,
        rate: number) {
            this.workOrderId = workOrderId;
            this.workerId = workerId;
            this.occupationId = occupationId;
            this.commentary = commentary;
            this.rate = rate;
    }

}