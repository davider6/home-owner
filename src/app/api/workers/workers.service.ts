import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROPS } from 'src/app/constants/properties';

@Injectable({
  providedIn: 'root'
})
export class WorkersService {

  public URL_SERVICE:string  = `${PROPS.backendUrl}workers`;

  constructor(private http: HttpClient) { }

  getWorkerById(workerId:string){
    return this.http.get(`${this.URL_SERVICE}/${workerId}`);
  }

}
