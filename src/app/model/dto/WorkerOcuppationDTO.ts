export class WorkerOccupationDTO {
    workerId: number;
    occupationId: number;
    hourlyRate: number;
    description: string;
    fullNameWorker: string;
    birthDateWorker: Date;
    genderWorker: string;
    nationalityIdWorker: number;
    emailWorker: string;
    telephoneNumberWorker: string;
    hasVehicleWorker: boolean;
    profileImageWorker: string;
    englishLevelWorker: string;
    zipCodeWorker: string;
    nameOccupation: string;
    descriptionOccupation: string;
    categoryImageOccupation: string;
    nameNationality: string;
    rate:number;
    latitudeWorker:number;
    longitudeWorker:number;
    selected: boolean;

    constructor(workerId: number, occupationId: number, hourlyRate: number, description: string, 
                fullNameWorker: string, birthDateWorker: Date, genderWorker: string, nationalityIdWorker: number,
                emailWorker: string, telephoneNumberWorker: string, hasVehicleWorker: boolean, profileImageWorker: string,
                englishLevelWorker: string, zipCodeWorker: string, nameOccupation: string, descriptionOccupation: string,
                categoryImageOccupation: string, nameNationality: string, rate: number, latitudeWorker: number, longitudeWorker: number) {
            this.workerId = workerId;
            this.occupationId = occupationId;
            this.hourlyRate = hourlyRate;
            this.description = description;
            this.fullNameWorker = fullNameWorker;
            this.birthDateWorker = birthDateWorker;
            this.genderWorker = genderWorker;
            this.nationalityIdWorker = nationalityIdWorker;
            this.emailWorker = emailWorker;
            this.telephoneNumberWorker = telephoneNumberWorker;
            this.hasVehicleWorker = hasVehicleWorker;
            this.zipCodeWorker = zipCodeWorker;
            this.profileImageWorker = profileImageWorker;
            this.englishLevelWorker = englishLevelWorker;
            this.nameOccupation = nameOccupation;
            this.descriptionOccupation = descriptionOccupation;
            this.categoryImageOccupation = categoryImageOccupation;
            this.nameNationality = nameNationality;
            this.rate = rate;
            this.latitudeWorker = latitudeWorker;
            this.longitudeWorker = longitudeWorker;
    }
  }
