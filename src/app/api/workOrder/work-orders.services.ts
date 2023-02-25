import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { PROPS } from "src/app/constants/properties";

@Injectable({
  providedIn: "root"
})
export class WorkOrderService {
  public URL_SERVICE = `${PROPS.backendUrl}workOrders`;

  constructor(private http: HttpClient) {}

  getWorkerRatingsByWorkerId(workerId: number){

    let URL:string = `${this.URL_SERVICE}/workerRatingsByWorkerId?workerId=${ workerId }`;

    console.log(URL);

    return this.http.get(URL);
  }
}
