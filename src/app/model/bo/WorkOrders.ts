import { WorkOrderWorker } from "../dto/WorkOrderWorker";
export class WorkOrders {
  id: number;
  clientId: number;
  occupationId: number;
  address: string;
  latitude: number;
  longitude: number;
  zipCode: string;
  description: string;
  proposedDate: Date;
  estimatedDate: Date;
  needVehicle: boolean;
  status: string;
  durationInHours: number;
  orderWorkersAmount: number;
  orderXjobsFee: number;
  orderDiscount: number;
  totalAmount: number;
  workers: WorkOrderWorker[];

  constructor(
    id: number,
    clientId: number,
    occupationId: number,
    address: string,
    latitude: number,
    longitude: number,
    zipCode: string,
    description: string,
    proposedDate: Date,
    estimatedDate: Date,
    needVehicle: boolean,
    status: string,
    durationInHours: number,
    orderWorkersAmount: number,
    orderXjobsFee: number,
    orderDiscount: number,
    totalAmount: number,
    workers: WorkOrderWorker[]
  ) {
    this.id = id;
    this.clientId = clientId;
    this.occupationId = occupationId;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.zipCode = zipCode;
    this.description = description;
    this.proposedDate = proposedDate;
    this.estimatedDate = estimatedDate;
    this.needVehicle = needVehicle;
    this.status = status;
    this.durationInHours = durationInHours;
    this.orderWorkersAmount = orderWorkersAmount;
    this.orderXjobsFee = orderXjobsFee;
    this.orderDiscount = orderDiscount;
    this.totalAmount = totalAmount;
    this.workers = workers;
  }
}
