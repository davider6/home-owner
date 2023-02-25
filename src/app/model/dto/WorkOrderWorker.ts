export class WorkOrderWorker {

    workerName: string;
    hours: number;
    feePerWorker: number;
    hourlyRate: number;

    constructor( workerName: string,
                 hours: number,
                 feePerWorker: number,
                 hourlyRate: number ) {
                    this.workerName = workerName;
                    this.hours = hours;
                    this.feePerWorker = feePerWorker;
                    this.hourlyRate = hourlyRate;
    }

}