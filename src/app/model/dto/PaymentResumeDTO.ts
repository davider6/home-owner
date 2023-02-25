export class PaymentResumeDTO {
    workerName: string;
    workerAmount: string;
    isTotal: boolean;

    constructor(workerName: string,
                workerAmount: string,
                isTotal: boolean) {
            this.workerName = workerName;
            this.workerAmount = workerAmount;
            this.isTotal = isTotal;
    }
  }
