import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpEvent,
  HttpRequest,
  HttpHeaders,
} from "@angular/common/http";
import { PROPS } from "../constants/properties";

import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ManageFilesServiceService {
  constructor(private http: HttpClient) {}

  pushFileToStorage(
    data: FormData,
    orderId: string,
    isClose: string,
    isTemp: string,
    token: string
  ): Observable<HttpEvent<{}>> {
    const headersObj = new HttpHeaders({
      Authorization: token,
      reportProgress: "true",
      responseType: "text",
    });
    console.log("'este es el token", token);
    const newRequest = new HttpRequest(
      "POST",
      PROPS.baseUrl +
        `uploadFile?orderId=` +
        orderId +
        "&isClose=" +
        isClose +
        "&isTemp=" +
        isTemp,
      data,
      {
        headers: headersObj,
      }
    );
    return this.http.request(newRequest);

    // this.http
    //   .post("https://x-jobs.exchange:8443/uploadFile?orderId=" + orderId, data)

    //   .subscribe(res => {
    //     console.log(res);
    //     if (res["success"]) {
    //       console.log("File upload complete.");
    //     } else {
    //       console.log("File upload failed.");
    //     }
    //   });
    // return true;
  }

  async listFiles(
    id: string,
    isClose: string,
    isTemp: string,
    token: string
  ): Promise<string[]> {
    let result;
    const headersObj = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token,
    });
    await this.http
      .get(
        PROPS.baseUrl +
          "filesByOrderId?orderId=" +
          id +
          "&isClose=" +
          isClose +
          "&isTemp=" +
          isTemp,
        {
          headers: headersObj,
        }
      )
      .toPromise()
      .then(
        (data) => {
          result = data;
        },
        (error) => {
          console.log("Error geting data: ", error);
          result = [];
        }
      );
    return result;
  }

  public async downloadResource(
    fileName: string,
    id: string,
    isClose: string,
    isTemp: string,
    token: string
  ): Promise<Blob> {
    const headersObj = new HttpHeaders({
      responseType: "blob" as "json",
      Authorization: token,
    });
    const file = await this.http
      .get<Blob>(
        PROPS.baseUrl +
          "downloadFile?fileName=" +
          fileName +
          "&orderId=" +
          id +
          "&isClose=" +
          isClose +
          "&isTemp=" +
          isTemp,
        {
          headers: headersObj,
        }
      )
      .toPromise();
    return file;
  }
}
