import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROPS } from 'src/app/constants/properties';

@Injectable({
  providedIn: 'root'
})
export class WorkersOccupationService {

  public URL_SERVICE = `${PROPS.backendUrl}workerOcuppations`;

  constructor(private http: HttpClient) { }

  getWorkersByOccupationId(occupationId:string){

    let URL:string = `${this.URL_SERVICE}/workerOcuppationsByOccupationId?occupationId=${occupationId}&occupationStatus=true&workerOccupationStatus=true&workerStatus=true`;

    //console.log(URL);

    return this.http.get(URL);
  }

  getWorkerOcuppationsByWorkerId(workerId: number){

    let URL:string = `${this.URL_SERVICE}/workerOcuppationsByWorkerId?workerId=${workerId}&occupationStatus=true&workerOccupationStatus=true&workerStatus=true`;

    //console.log(URL);

    return this.http.get(URL);
  }

}
