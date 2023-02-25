export class WoAssigned {
  workOrderId: number;
  workerId: number;
  proposedDate: Date;
  startTime: Date;
  finishTime: Date;
  status: string;
  workerComments: string;
  workOrderRate: number;
  clientComments: string;
  occupationId: number;
  durationInHours: number;
  orderWorkerAmount: number;
  orderXjobsFee: number;
  orderDiscount: number;
  totalAmount: number;

  constructor(
    workOrderId: number,
    workerId: number,
    proposedDate: Date,
    startTime: Date,
    finishTime: Date,
    status: string,
    workerComments: string,
    workOrderRate: number,
    clientComments: string,
    occupationId: number,
    durationInHours: number,
    orderWorkerAmount: number,
    orderXjobsFee: number,
    orderDiscount: number,
    totalAmount: number,
  ) {
    this.workOrderId = workOrderId;
    this.workerId = workerId;
    this.proposedDate = proposedDate;
    this.startTime = startTime;
    this.finishTime = finishTime;
    this.status = status;
    this.workerComments = workerComments;
    this.workOrderRate = workOrderRate;
    this.clientComments = clientComments;
    this.occupationId = occupationId;
    this.durationInHours = durationInHours;
    this.orderWorkerAmount = orderWorkerAmount;
    this.orderXjobsFee = orderXjobsFee;
    this.orderDiscount = orderDiscount;
    this.totalAmount = totalAmount;
  }
}
