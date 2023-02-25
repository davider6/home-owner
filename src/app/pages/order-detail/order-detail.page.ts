import { Component, OnInit, ViewChild } from '@angular/core';
import { BackendService } from '../../api/backend/backend.service';
import { Router } from '@angular/router';
import { PhotoViewer } from '@capacitor/photo-viewer/ngx';
import { AlertController, Platform, NavController, LoadingController, IonSlides } from '@ionic/angular';
import { ClientOrderHistoryDTO } from '../../model/dto/ClientOrderHistoryDTO';
import { RequestFields } from '../../model/bo/RequestFields';
import { Observable } from 'rxjs/internal/Observable';
import { AcceptRejectDateRequestDTO } from '../../model/dto/AcceptRejectDateRequestDTO';
import { RatingComponent } from '../../components/rating/rating.component';
import { FinalizeOrderRequestDTO } from '../../model/dto/FinalizeOrderRequestDTO';

@Component({
  providers: [RatingComponent],
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {

  loadingSpin=null;
  orderDetails: ClientOrderHistoryDTO;
  token: string;
  segment = 0;
  rating: number = 0;
  closeCommentary;
  icon1="/assets/icon/empty-star.png";
  icon2="/assets/icon/empty-star.png";
  icon3="/assets/icon/empty-star.png";
  icon4="/assets/icon/empty-star.png";
  icon5="/assets/icon/empty-star.png";

  user: string = "";
  nextStep: string;

  homeOwnerPics: string[] = [];

  workerPics: string[] = [];

  finalize: boolean = false;
  dateChange: boolean = false;

  sliderOpts = {
    zoom: false,
    slidesPerview: 1.5,
    centeredSlides: true,
    spaceBetween: 20,
  };

  @ViewChild("slides", { static: true }) slider: IonSlides;

  constructor(public backend: BackendService,
    private router: Router,
    private plt: Platform,
    private alertController: AlertController,
    private nav: NavController,
    private loadingController: LoadingController,
    private photoViewer: PhotoViewer,
    private ratingComponent: RatingComponent) { 
      this.closeCommentary = "";
      this.rating = 0;
      this.icon1="/assets/icon/empty-star.png";
      this.icon2="/assets/icon/empty-star.png";
      this.icon3="/assets/icon/empty-star.png";
      this.icon4="/assets/icon/empty-star.png";
      this.icon5="/assets/icon/empty-star.png";
      try {
        if (this.router.getCurrentNavigation().extras.state) {
          this.orderDetails = this.router.getCurrentNavigation().extras.state.order;
          console.log('Detalles de orden extras order['+JSON.stringify(this.orderDetails)+"]");
          this.token = this.router.getCurrentNavigation().extras.state.token;
          this.cargarImagenes();
          this.cargarImagenesClose();
        } else {
          this.router.navigate(['/home']);
        }
      } catch(e) {
        console.log(e); 
        this.router.navigate(['/home']);
      }
    }

  async ngOnInit() {
    await this.plt.ready();
  }

  async segmentChanged() {
    this.slider.lockSwipes(false);
    await this.slider.slideTo(this.segment);
    this.slider.lockSwipes(true);
  }

  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }

  onChangeRating(index: number) {
    this.rating = index;
    console.log("rating: " + this.rating);
    for (var _i = 1; _i < 6; _i++){
      if(_i<=index){
        if(_i==1) {
          this.icon1 ="/assets/icon/full-star.png";
        }
        if(_i==2) {
          this.icon2 ="/assets/icon/full-star.png";
        }
        if(_i==3) {
          this.icon3 ="/assets/icon/full-star.png";
        }
        if(_i==4) {
          this.icon4 ="/assets/icon/full-star.png";
        }
        if(_i==5) {
          this.icon5 ="/assets/icon/full-star.png";
        }
      } else {
        if(_i==1) {
          this.icon1 ="/assets/icon/empty-star.png";
        }
        if(_i==2) {
          this.icon2 ="/assets/icon/empty-star.png";
        }
        if(_i==3) {
          this.icon3 ="/assets/icon/empty-star.png";
        }
        if(_i==4) {
          this.icon4 ="/assets/icon/empty-star.png";
        }
        if(_i==5) {
          this.icon5 ="/assets/icon/empty-star.png";
        }
      }
    }
  }

  closeOrder() {
    if (!this.rating || this.rating === 0) {
      this.presentAlert("Rate for the worker attention is required", false);
      return;
    } else if (!this.closeCommentary || this.closeCommentary =='') {
      this.presentAlert("Your experience whith the worker is required.", false);
      return;
    } else {
      const req: FinalizeOrderRequestDTO = {
        workOrderId: this.orderDetails.orderId,
        workerId: this.orderDetails.workerId,
        occupationId: this.orderDetails.occupationId,
        commentary: this.closeCommentary,
        rate: this.rating,
      };
      console.log('objeto a enviar ', JSON.stringify(req));
    this.closeWoOrder(req).toPromise().then( async (result) => {
      console.log('Respuesta obtenida');
      const mensaje = "Order closed ";
      if(this.loadingSpin != null){
        this.loadingSpin.dismiss();
      }
      const alert = await this.alertController.create({
        header: "Job Exchange",
        subHeader: "Close order",
        message: mensaje,
        buttons: [
          {
            text: "OK",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              console.log("Confirm OK");
            },
          },
        ],
      });
      await alert.present();
      this.router.navigate(['/home']);
    })
    .catch((e) => {
      console.log("error,", e);
      if(this.loadingSpin != null){
       this.loadingSpin.dismiss();
       }
   });
    }
  }


  verUbicacion(){
  }

  async presentAlert(message: any, back: boolean) {
    const alert = await this.alertController.create({
      header: "Order closure",
      subHeader: "Job Exchange",
      message,
      buttons: ["OK"],
    });

    await alert.present();

    if (back) {
      this.nav.navigateForward("/home");
    }
  }

  imagePreview(img){
    this.photoViewer.show(img);
  }

  cargarImagenes(){
    const reqField: RequestFields[] = [
      { fieldName: "isClose", fieldValue: 'false' },
      // { fieldName: "isTemp", fieldValue: this.isTemp },
      { fieldName: "isTemp", fieldValue: 'false' },
      { fieldName: "orderId", fieldValue: this.orderDetails.orderId.toString() },
    ];

    this.backend
        .getItemsByMethodWithoutContext("urlFilesByOrderId", "", reqField, this.token)
        .subscribe(
          (resp) => {
             console.log('resp img carga',resp);
            this.homeOwnerPics = resp as string[];
          },
          (error2) => {
            console.error(JSON.stringify(error2));
          }
        );
  }

  cargarImagenesClose(){
    const reqField: RequestFields[] = [
      { fieldName: "isClose", fieldValue: 'true' },
      // { fieldName: "isTemp", fieldValue: this.isTemp },
      { fieldName: "isTemp", fieldValue: 'false' },
      { fieldName: "orderId", fieldValue: this.orderDetails.orderId.toString() },
    ];

    this.backend
        .getItemsByMethodWithoutContext("urlFilesByOrderId", "", reqField, this.token)
        .subscribe(
          (resp) => {
            console.log('resp img close',resp);
            this.workerPics = resp as string[];
          },
          (error2) => {
            console.error(JSON.stringify(error2));
          }
        );
  }

  async accepOrRejectDate(acceptedReq: string) {
    console.log('Ingreso a boton de accion');
    const accepted = acceptedReq == 'Y' ? true : false;
    //await this.loadingSpin.present();
    const req: AcceptRejectDateRequestDTO = {
      acceptChange: accepted,
      workOrderId: this.orderDetails.orderId,
      workerId: this.orderDetails.workerId,
      occupationId: this.orderDetails.occupationId,
    };
    console.log('objeto a enviar ', JSON.stringify(req));
    this.acceptOrReject(req).toPromise().then( async (result) => {
      console.log('Respuesta obtenida');
      const mensaje = "Date change " + (accepted ? 'accepted' : 'rejected');
      if(this.loadingSpin != null){
        this.loadingSpin.dismiss();
      }
      const alert = await this.alertController.create({
        header: "Job Exchange",
        subHeader: "Accept or Reject Date Change",
        message: mensaje,
        buttons: [
          {
            text: "OK",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              console.log("Confirm OK");
            },
          },
        ],
      });
      await alert.present();
      this.router.navigate(['/home']);
    })
    .catch((e) => {
      console.log("error,", e);
      if(this.loadingSpin != null){
       this.loadingSpin.dismiss();
       }
   });

  }

  public acceptOrReject(acceptReject: AcceptRejectDateRequestDTO): Observable<any> {
    return this.backend.insertEntity(
      "woAssigned/acceptRejectDateChange",
      acceptReject,
      this.token
    );
  }

  public closeWoOrder(acceptReject: FinalizeOrderRequestDTO): Observable<any> {
    return this.backend.insertEntity(
      "workOrders/finalizeWorkOrder",
      acceptReject,
      this.token
    );
  }

  formatDate(date) {
    var d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [month, day, year].join('-');
  }

  validateImageL(url) {
    //console.log('Url imagen ' + url)
    if (url !== null && url != '') {
      return url;
    } else {
      return '../../../../assets/profiles/profile.jpg';
    }
  }

}
