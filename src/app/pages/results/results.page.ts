import { Component, OnInit } from '@angular/core';
import { PROPS } from "../../constants/properties";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit {

  hasVehicle:boolean;
  occupationsId:string;
  zipCode:string;

  constructor(private http:HttpClient,
              private actRoute:ActivatedRoute) { 
    this.findWorkers();            
              }

  ngOnInit() {
    /*this.occupationsId = this.actRoute.snapshot.paramMap.get('occupationsId');
    this.occupationsId = this.actRoute.snapshot.paramMap.get('occupationsId');
    this.zipCode = this.actRoute.snapshot.paramMap.get('zipCode');*/
  }

  findWorkers(){
    //let URL:string = `${PROPS.backendUrl}workerOcuppations/workerOcuppationsEngine?hasVehicle=${this.hasVehicle}&occupationsIds=${this.occupationsId}&zipCode=${this.zipCode}`;
    let URL:string = `${PROPS.backendUrl}workerOcuppations/workerOcuppationsEngine?hasVehicle=false&occupationsIds=3&zipCode=01010`;

    return this.http.get(URL)
          .subscribe( (data) => {
            console.log(data);
          });

  }

}
