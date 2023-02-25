export class TotalOrderByWorkerDTO {

    status: string;
    total: number;

    constructor( status: string,
                 total: number ){
                    this.status = status;
                    this.total = total;
    }

}