import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ToastController,
  Platform,
  IonSlides
} from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation
} from '@capacitor/google-maps';
import { NgLocalization } from '@angular/common';
import { BackendService } from 'src/app/api/backend/backend.service';
import { Occupations } from 'src/app/model/bo/Occupations';
import { RequestFields } from 'src/app/model/bo/RequestFields';
import { WorkerOccupationDTO } from 'src/app/model/dto/WorkerOcuppationDTO';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  map: GoogleMap;
  address:string;
  segment = 0;
  occupationsList: number[] = [];
  occupationsMap = new Map();
  workerOccupationsList: WorkerOccupationDTO[] = [];
  workerOccupationMap = new Map();
  consulta = false;

  @ViewChild('slides', { static: true }) slider: IonSlides;
 
  constructor(
    public toastCtrl: ToastController,
    private platform: Platform,
    private backendService: BackendService
    ) { 
    }
 
  ngOnInit() {

    this.loadData();

    // Since ngOnInit() is executed before `deviceready` event,
    // you have to wait the event.
    this.platform.ready();
    // this.loadMap();
    this.slider.lockSwipes(true);
  }
 
  loadMap() {
    this.map = GoogleMaps.create('map_canvas', {
      // camera: {
      //   target: {
      //     lat: 43.0741704,
      //     lng: -89.3809802
      //   },
      //   zoom: 18,
      //   tilt: 30
      // }
    });
    this.goToMyLocation();
  }
 
 
  goToMyLocation(){
    this.map.clear();
 
    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
 
      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: location.latLng,
        zoom: 14,
        duration: 3000
      });

      

      let markers: Marker[] = [];

      for ( let worker of this.workerOccupationsList) {

        console.log(worker.fullNameWorker, worker.nameOccupation);

        let marker: Marker = this.map.addMarkerSync({
              title: `${worker.nameOccupation} (Rating: ${worker.rate})`,
              snippet: `${worker.description} - Hourly Rate: $${worker.hourlyRate}`,
              icon: {
                url: '/assets/icon/favicon.png',
                size: {
                  width: 24,
                  height: 24
              }},
              position: { "lat": worker.latitudeWorker, "lng": worker.longitudeWorker },
              animation: GoogleMapsAnimation.BOUNCE}
            );
          
        marker.showInfoWindow();

        markers.push(marker);
      }
      
    })
    .catch(err => {
      //this.loading.dismiss();
      this.showToast(err.error_message);
    });
  }
 
  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  async segmentChanged() {
    this.slider.lockSwipes(false);
    await this.slider.slideTo(this.segment);
    this.slider.lockSwipes(true);
  }

  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }

  loadData() {
        
        let vehicleReq = false;

        let reqField: RequestFields[] = [ {fieldName: 'zipCode', fieldValue: '10007'},
                                          {fieldName: 'hasVehicle', fieldValue: vehicleReq+''}
                                        ];
        
                                        reqField.push({fieldName: 'occupationsIds', fieldValue: '3'});
                                        reqField.push({fieldName: 'occupationsIds', fieldValue: '12'});
                                        reqField.push({fieldName: 'occupationsIds', fieldValue: '13'});
                                        reqField.push({fieldName: 'occupationsIds', fieldValue: '14'});
        
          this.occupationsList.push(3);
          this.occupationsList.push(12);
          this.occupationsList.push(13);
          this.occupationsList.push(14);

        this.backendService.getItemsByMethod('workerOcuppations', 'workerOcuppationsEngine', reqField, sessionStorage.getItem('token')).subscribe(resp => {

          console.log(resp);

          this.workerOccupationsList = (resp as WorkerOccupationDTO[]);

          for ( let occupation of this.occupationsList) {

            const workOcc: WorkerOccupationDTO[] = this.workerOccupationsList.filter(
              x => x.occupationId == occupation);
            this.workerOccupationMap.set(occupation, workOcc);
            let occ = {
              'nameOccupation': workOcc[0].nameOccupation,
              'categoryImageOccupation': workOcc[0].categoryImageOccupation
            };
            this.occupationsMap.set(occupation,occ);
          }

          this.consulta = true;

          this.loadMap();

        }, error2 => {
          console.error(JSON.stringify(error2));
        });
  }

}
