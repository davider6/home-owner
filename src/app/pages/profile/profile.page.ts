import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkersService } from 'src/app/api/workers/workers.service';
import { OccupationsService } from 'src/app/api/occupations/occupations.service';
import { IonSlides } from '@ionic/angular';
import { WorkersOccupationService } from 'src/app/api/workersOccupation/workers-occupation.service';
import { WorkOrderService } from 'src/app/api/workOrder/work-orders.services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @ViewChild('slides', { static: true }) slider: IonSlides;

  occupationId:string = null;
  occupation:any = {};
  segment = 0;
  workerId:string = null;
  worker:any = {};
  occupationsRating: any[] = [];
  workerRatings: any[] = [];

  constructor( private actRoute: ActivatedRoute,
               private wApi: WorkersService,
               private oApi: OccupationsService, 
               private wocApi: WorkersOccupationService,
               private woApi: WorkOrderService ) { }

  ngOnInit() {
    this.occupationId = this.actRoute.snapshot.paramMap.get('occupationId');
    this.workerId = this.actRoute.snapshot.paramMap.get('workerId');
    this.getWorker(this.workerId);
    this.getOccupationId(this.occupationId)
    this.getOccupationsRating( Number(this.workerId) );
    this.getWorkerRatings( Number(this.workerId) );
  }

  doRefresh(event:any) {
    setTimeout(() => {
      
      this.getWorker(this.workerId);
      this.getOccupationId(this.occupationId)
      this.getOccupationsRating( Number(this.workerId) );
      this.getWorkerRatings( Number(this.workerId) );

      event.target.complete();
    }, 1500);
  }

  getWorker(workerId:string){
    this.wApi
      .getWorkerById(workerId)
      .subscribe( (resp) => {        
        this.worker = resp;
        console.log("resp",this.worker);
        console.log("algo",resp['fullName']);
        console.log("algo",resp['fullName'].split(" ",1));
        this.worker['fullName'] = resp['fullName'].split(" ",1);
      });
  }

  getOccupationId(occupationId:string){
    this.oApi
      .getOccupationById(occupationId)
      .subscribe( (resp) => {
        this.occupation = resp;
      });
  }

  async segmentChanged() {
    await this.slider.slideTo(this.segment);
  }

  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }

  getOccupationsRating( workerId: number ){
    this.wocApi.getWorkerOcuppationsByWorkerId( workerId )
        .subscribe( (resp: any[]) => {

          this.occupationsRating = resp;

        });
  }

  getWorkerRatings( workerId: number ){
    this.woApi.getWorkerRatingsByWorkerId( workerId )
        .subscribe( (resp: any[]) => {

          // console.log(resp);

          this.workerRatings = resp;

        });
  }

}
