export class WorkOrderHistoryDTO {
  orderId: number;
  status: string;
  clientId: number;
  address: string;
  zipCode: string;
  workDate: Date;
  occupationId: number;
  occupation: string;
  description: string;
  statusColor: string;
  occupationAvatar: string;
  requestedImages: string;
  resultImages: string;
  rating: number;
  resultComment: string;
  tempOrderId: number;

  constructor(
    orderId: number,
    status: string,
    clientId: number,
    address: string,
    zipCode: string,
    workDate: Date,
    occupationId: number,
    occupation: string,
    description: string,
    statusColor: string,
    occupationAvatar: string,
    requestedImages: string,
    resultImages: string,
    rating: number,
    resultComment: string,
    tempOrderId: number
  ) {
    this.orderId = orderId;
    this.status = status;
    this.clientId = clientId;
    this.address = address;
    this.zipCode = zipCode;
    this.workDate = workDate;
    this.occupationId = occupationId;
    this.occupation = occupation;
    this.description = description;
    this.statusColor = statusColor;
    this.occupationAvatar = occupationAvatar;
    this.requestedImages = requestedImages;
    this.resultImages = resultImages;
    this.rating = rating;
    this.resultComment = resultComment;
    this.tempOrderId = tempOrderId;
  }
}
