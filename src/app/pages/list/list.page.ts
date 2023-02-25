import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkersOccupationService } from 'src/app/api/workersOccupation/workers-occupation.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  occupationId:string = null;
  workers:any = [];
  urlNew = '/new-order';

  constructor(private actRoute: ActivatedRoute,
              private api: WorkersOccupationService,
              private nav: NavController) {
              }

  ngOnInit() {
    this.occupationId = this.actRoute.snapshot.paramMap.get('occupationId');
    //console.log('parametro:'+this.occupationId);
    this.loadWorkers();
  }

  loadWorkers(){
    this.api.getWorkersByOccupationId(this.occupationId)
    .subscribe( (resp) => {
      console.log(resp);
      this.workers = resp;
    });
  }

  goProfile(occupationId, workerId){
    this.nav.navigateForward(`/profile/${occupationId}/${ workerId }`);
  }

}
