import { Component, OnInit, ViewChild } from "@angular/core";
import { Storage } from "@ionic/storage";
import { ActivatedRoute, Router } from "@angular/router";
import { File } from "@capacitor/file/ngx";
import {
  IonSlides,
  NavController,
  Platform,
  AlertController,
  LoadingController,
} from "@ionic/angular";
import { WorkOrderService } from "../../../api/workOrder/work-orders.services";
import { Token } from "src/app/model/bo/Token";
import { HttpClient } from "@angular/common/http";
import { WorkOrderHistoryDTO } from "src/app/model/dto/WorkOrderHistoryDTO";
import { ImageSliderComponent } from "../../../components/image-slider/image-slider.component";

const MEDIA_FOLDER_NAME = "new_orders";

@Component({
  providers: [ImageSliderComponent],
  selector: "app-order-details",
  templateUrl: "./order-details.page.html",
  styleUrls: ["./order-details.page.scss"],
})
export class OrderDetailsPage implements OnInit {
  orderDetails: WorkOrderHistoryDTO;
  segment = 0;
  rating: number = 0;
  closing: boolean = false;
  // loading: any;
  user: string = "";
  nextStep: string;
  isTemp: string = "false";
  token: Token;
  sliderOpts = {
    zoom: false,
    slidesPerview: 1.5,
    centeredSlides: true,
    spaceBetween: 20,
  };

  @ViewChild("slides", { static: true }) slider: IonSlides;

  constructor(
    private wos: WorkOrderService,
    private file: File,
    private router: Router,
    private plt: Platform,
    private http: HttpClient,
    private alertController: AlertController,
    private nav: NavController,
    private loadingController: LoadingController,
    private imageSlider: ImageSliderComponent,
    private actRoute: ActivatedRoute,
    private storage: Storage
  ) {
    console.log(this.router.getCurrentNavigation());
    if (this.router.getCurrentNavigation().extras.state) {
      this.orderDetails = this.router.getCurrentNavigation().extras.state.order;
      console.log(this.orderDetails);
      if (this.orderDetails.tempOrderId) {
        this.isTemp = "true";
      }
    }
  }

  // async presentLoading() {
  //   this.loading = await this.loadingController.create({
  //     message: "Please wait...",
  //   });
  //   await this.loading.present();

  //   const { role, data } = await this.loading.onDidDismiss();
  //   console.log("Loading dismissed!");
  // }

  ngOnInit() {
    this.user = sessionStorage.getItem("userName");
    this.storage.get("token").then((tk) => {
      this.token = tk;
    });
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
  }

  createNewOrder() {
    this.nav.navigateForward("/new-order");
  }

  setCloseOrder() {
    this.closing = true;
  }

  async closeOrder(form: any) {
    const { description = "" } = { ...form.value };

    if (description == "") {
      this.presentAlert("No ha ingresado comentario.", false);
    } else if (this.rating == 0) {
      this.presentAlert("No ha ingresado su valoracion.", false);
    } else {
      // this.presentLoading();
      const updatedOrder = {
        id: this.orderDetails.orderId,
        status: "FINISHED",
        clientId: this.orderDetails.clientId,
        address: this.orderDetails.address,
        zipCode: this.orderDetails.zipCode,
        workDate: this.orderDetails.workDate,
        occupationId: this.orderDetails.occupationId,
        description: this.orderDetails.description,
        requestedImages: this.orderDetails.requestedImages,
        resultImages: this.orderDetails.resultImages,
        rating: this.rating,
        resultComment: description,
      };
      console.log("updatedOrder", updatedOrder);
      const loading = await this.loadingController.create({
        message: "Uploading image...",
      });
      await loading.present();
      this.http
        .put(
          this.wos.URL_SERVICE + "/" + this.orderDetails.orderId,
          updatedOrder
        )
        .subscribe(
          async (data) => {
            this.imageSlider.closed = true;
            const a = await this.imageSlider.prepareFilesToUpload(
              this.orderDetails.orderId,
              true,
              false,
              this.token.token
            );
            loading.dismiss();
            this.presentAlert("La orden se ha cerrado exitosamente", true);
          },
          (error) => {
            console.log(error);
            this.presentAlert(error, false);
          }
        );
    }
  }

  async presentAlert(message: any, back: boolean) {
    const alert = await this.alertController.create({
      header: "Cierre de Orden",
      subHeader: "Job Exchange",
      message,
      buttons: ["OK"],
    });

    await alert.present();

    if (back) {
      this.nav.navigateForward("/home");
    }
  }
}
