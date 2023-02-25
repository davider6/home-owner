import { CategoryOccupationDTO } from "./CategoryOccupationDTO";
import { WorkerOccupationDTO } from "./WorkerOcuppationDTO";
export class SelectionRequestDTO {
  selDate: Date;
  selResources: number;
  selAddress: string;
  selDuration: number;
  selZipCode: string;
  selVehicle: boolean;
  selDescription: string;
  selSubCategories: CategoryOccupationDTO[];
  selWorkers: WorkerOccupationDTO[];

  constructor(
    selDate: Date,
    selResources: number,
    selAddress: string,
    selDuration: number,
    selZipCode: string,
    selVehicle: boolean,
    selDescription: string,
    selSubCategories: CategoryOccupationDTO[],
    selWorkers: WorkerOccupationDTO[]
  ) {
    this.selDate = selDate;
    this.selResources = selResources;
    this.selAddress = selAddress;
    this.selDuration = selDuration;
    this.selZipCode = selZipCode;
    this.selVehicle = selVehicle;
    this.selDescription = selDescription;
    this.selSubCategories = selSubCategories;
    this.selWorkers = selWorkers;
  }
}
