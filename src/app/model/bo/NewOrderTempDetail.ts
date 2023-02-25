export class NewOrderTempDetail {
    id: number;
    newOrderTempId: number;
    occupationId: number;
    workerId: number;
    constructor(id: number,
                newOrderTempId: number,
                occupationId: number,
                workerId: number) {
        this.id = id;
        this.newOrderTempId = newOrderTempId;
        this.occupationId = occupationId;
        this.workerId = workerId;
    }
}