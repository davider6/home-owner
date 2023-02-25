import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { Occupations } from "../../model/bo/Occupations";
import { ToastController, LoadingController, IonSlides } from "@ionic/angular";
import { BackendService } from "../../api/backend/backend.service";
import { RequestFields } from "../../model/bo/RequestFields";
import { Token } from "../../model/bo/Token";
import { Storage } from "@ionic/storage";
import { ClientOrderHistoryDTO } from "../../model/dto/ClientOrderHistoryDTO";

@Component({
  selector: "app-order-history",
  templateUrl: "./order-history.page.html",
  styleUrls: ["./order-history.page.scss"],
})
export class OrderHistoryPage implements OnInit {
  loadingSpin = null;
  orders: ClientOrderHistoryDTO[] = [];
  closedOrders: ClientOrderHistoryDTO[] = [];
  occupationsList: Occupations[];
  loaded = false;
  token: Token;
  status: string = "";
  clientId: string = "";
  segment = 0;

  sliderOpts = {
    zoom: false,
    slidesPerview: 1.5,
    centeredSlides: true,
    spaceBetween: 20,
  };

  @ViewChild("slides", { static: true }) slider: IonSlides;

  constructor(
    public router: Router,
    public actRoute: ActivatedRoute,
    private toastController: ToastController,
    public loadingController: LoadingController,
    public backend: BackendService,
    private storage: Storage
  ) {
    this.clientId = this.actRoute.snapshot.paramMap.get("clientId");
    console.log("ClientId ", this.clientId);
    this.loadAll(this.clientId);
  }

  ngOnInit() {
    this.getOrdersByClientId(this.clientId);
  }

  async segmentChanged() {
    this.slider.lockSwipes(false);
    await this.slider.slideTo(this.segment);
    this.slider.lockSwipes(true);
  }

  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }

  updateData(event) {
    this.loaded = false;
    this.getOrdersByClientId(this.clientId);
    event.target.complete();
  }

  async loadAll(clientId) {
    this.token = await this.storage.get("token");
    console.log("beforeLoad ");
    await this.getClosedOrdersByClientId(clientId);
    await this.getOrdersByClientId(clientId);
  }

  async getOrdersByClientId(clientId) {
    const reqField: RequestFields[] = [
      { fieldName: "clientId", fieldValue: this.clientId },
    ];
    this.backend
      .getItemsByMethod(
        "workOrders",
        "getOrdersByClientId",
        reqField,
        this.token.token
      )
      .toPromise()
      .then(
        (resp: ClientOrderHistoryDTO[]) => {
          console.log("InProgressOrders ");
          resp.sort(this.sortFunction);
          this.orders = resp;
          this.loaded = true;
          // console.log(this.orders);
          if (this.loadingSpin != null) {
            this.loadingSpin.dismiss();
          }
        },
        (error2) => {
          console.error(JSON.stringify(error2));
        }
      );
  }

  async getClosedOrdersByClientId(clientId) {
    const reqField: RequestFields[] = [
      { fieldName: "clientId", fieldValue: this.clientId },
    ];
    this.backend
      .getItemsByMethod(
        "workOrders",
        "getClosedOrdersByClientId",
        reqField,
        this.token.token
      )
      .toPromise()
      .then(
        (resp: ClientOrderHistoryDTO[]) => {
          console.log("ClosedOrders ", JSON.stringify(resp));
          resp.sort(this.sortFunction);
          this.closedOrders = resp;
          if (this.loadingSpin != null) {
            this.loadingSpin.dismiss();
          }
        },
        (error2) => {
          console.error(JSON.stringify(error2));
        }
      );
  }

  sortFunction(a, b) {
    var dateA = new Date(a.workDate).getTime();
    var dateB = new Date(b.workDate).getTime();
    return dateB > dateA ? 1 : -1;
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  goBack() {
    this.router.navigate(["/home"]);
  }

  async openDetails(order) {
    const navigationExtras: NavigationExtras = {
      state: {
        order,
        token: this.token.token,
      },
    };
    console.log("Navegando a detalles de la orden natigate");
    try {
      this.router.navigate(["order-detail"], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }
}
