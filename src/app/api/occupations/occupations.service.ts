import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROPS } from '../../constants/properties';

@Injectable({
  providedIn: 'root'
})
export class OccupationsService {

  private URL_SERVICE:string  = `${ PROPS.backendUrl }occupations`;

  constructor(private http: HttpClient) { }

  public getOccupations(){
    return this.http.get(`${this.URL_SERVICE}`);
  }

  public getOccupationById(occupationId:string){
    return this.http.get(`${this.URL_SERVICE}/${occupationId}`);
  }
  
}
