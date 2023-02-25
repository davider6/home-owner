export class ClientOrderHistoryDTO {

     isPublic: boolean;
     //Client Data
     clientId: number;
     clientEmail: string;
     clientDeviceId: string;
     clientName: string;
     //Order Data
     orderId: number;
     status: string;
     zipCode: string;
     address: string;
     orderProposedDate: Date;
     latitude: number;
     longitude: number;
     description: string;
     //Assigned Data
     workerId: number;
     occupationId: number;
     assignedProposedDate: Date;
     startTime: Date;
     finishTime: Date;
     assignedStatus: string;
     workerComments: string;
     workOrderRate: number;
     clientComments: string;
     durationInHours: number;
     orderWorkerAmount: number;
     totalAmount: number;
     //Public Work Data
     publicWorksId: number;
     //Occupation Data
     occupationName: string;
     occupationImage: string;
     //Worker Occupation Data
     hourlyRate: number;
     occupationRate: number;
     occupationReviews: number;
     //workerData
     workerName: string;
     profileImage: string;
     workerDeviceId: string;
     workerEmail: string;

 constructor(
     isPublic: boolean,
     clientId: number,
     clientEmail: string,
     clientDeviceId: string,
     clientName: string,
     orderId: number,
     status: string,
     zipCode: string,
     address: string,
     orderProposedDate: Date,
     latitude: number,
     longitude: number,
     description: string,
     workerId: number,
     occupationId: number,
     assignedProposedDate: Date,
     startTime: Date,
     finishTime: Date,
     assignedStatus: string,
     workerComments: string,
     workOrderRate: number,
     clientComments: string,
     durationInHours: number,
     orderWorkerAmount: number,
     totalAmount: number,
     publicWorksId: number,
     occupationName: string,
     occupationImage: string,
     hourlyRate: number,
     occupationRate: number,
     occupationReviews: number,
     workerName: string,
     profileImage: string,
     workerDeviceId: string,
     workerEmail: string
  ) {
    this.isPublic = isPublic;
    this.clientId = clientId;
    this.clientEmail = clientEmail;
    this.clientDeviceId = clientDeviceId;
    this.clientName = clientName;
    this.orderId = orderId;
    this.status = status;
    this.zipCode = zipCode;
    this.address = address;
    this.orderProposedDate = orderProposedDate;
    this.latitude = latitude;
    this.longitude = longitude;
    this.description = description;
    this.workerId = workerId;
    this.occupationId = occupationId;
    this.assignedProposedDate = assignedProposedDate;
    this.startTime = startTime;
    this.finishTime = finishTime;
    this.assignedStatus = assignedStatus;
    this.workerComments = workerComments;
    this.workOrderRate = workOrderRate;
    this.clientComments = clientComments;
    this.durationInHours = durationInHours;
    this.orderWorkerAmount = orderWorkerAmount;
    this.totalAmount = totalAmount;
    this.publicWorksId = publicWorksId;
    this.occupationName = occupationName;
    this.occupationImage = occupationImage;
    this.hourlyRate = hourlyRate;
    this.occupationRate = occupationRate;
    this.occupationReviews = occupationReviews;
    this.workerName = workerName;
    this.profileImage = profileImage;
    this.workerDeviceId = workerDeviceId;
    this.workerEmail = workerEmail;
  }

}