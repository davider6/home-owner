import { environment } from "./../../../../environments/environment.prod";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NavController,
  AlertController,
  IonBackButtonDelegate,
  LoadingController,
} from "@ionic/angular";
import { BackendService } from "../../../api/backend/backend.service";
import { WorkOrders } from "../../../model/bo/WorkOrders";
import { WoAssigned } from "../../../model/bo/WoAssigned";
import { Clients } from "src/app/model/bo/Clients";
import { Observable } from "rxjs/internal/Observable";
import { WorkOrderService } from "../../../api/workOrder/work-orders.services";
import { HttpClient } from "@angular/common/http";
import { SelectionRequestDTO } from "../../../model/dto/SelectionRequestDTO";
import { Storage } from "@ionic/storage";
import { Token } from "src/app/model/bo/Token";
import { ImageSliderComponent } from "../../../components/image-slider/image-slider.component";
import { PaymentResumeDTO } from "../../../model/dto/PaymentResumeDTO";
import { WorkOrderWorker } from "../../../model/dto/WorkOrderWorker";
import {
  loadStripe,
  Stripe,
  StripeCardCvcElement,
  StripeCardExpiryElement,
  StripeCardNumberElement,
} from "@stripe/stripe-js";

import { finalize } from "rxjs/operators";

@Component({
  providers: [ImageSliderComponent],
  selector: "app-payments",
  templateUrl: "./payments.page.html",
  styleUrls: ["./payments.page.scss"],
})
export class PaymentsPage implements OnInit {
  @ViewChild(IonBackButtonDelegate, { static: false })
  backButton: IonBackButtonDelegate;
  selection: SelectionRequestDTO;
  amount = 0;
  workersNumber = 0;
  feePerWorker = 10;
  totalService = 0;
  total = 0;

  client: Clients;
  token: Token;
  loaded = false;
  loadingSpin;

  disabled = false;
  stripe: Stripe;
  cardNumberElement: StripeCardNumberElement;
  cardExpiryElement: StripeCardExpiryElement;
  cardCvcElement: StripeCardCvcElement;
  name: string;
  errorMessage = {
    name: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  };

  selectedWorkersAmount: PaymentResumeDTO[] = [];

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private nav: NavController,
    private backendService: BackendService,
    private alertController: AlertController,
    private http: HttpClient,
    private wos: WorkOrderService,
    private storage: Storage,
    private imageSlider: ImageSliderComponent,
    private loadingController: LoadingController
  ) {
    this.storage.get("token").then((tk) => {
      this.token = tk;
    });

    if (this.router.getCurrentNavigation().extras.state) {
      this.selection = this.router.getCurrentNavigation().extras.state.order;
      this.loadForm();
    }
  }

  async ngOnInit() {
    this.stripe = await loadStripe(
      "pk_test_51JlIbdLkBOLPAC1hucsMPonFWGj6dNUBAbpAKaJ6eT1KZz3CGhMIc88ol8Ca4OoY4CN0qYw3LU2hSLJ054qCOGUT00LpTYcJvA"
    );

    const elements = this.stripe.elements();

    const style = {
      base: {
        color: "#b6b6b6",
        fontSmoothing: "antialiased",
        "::placeholder": {
          color: "#b6b6b6",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    };

    this.cardNumberElement = elements.create("cardNumber", {
      style,
      placeholder: "Card Number",
      showIcon: true,
    });
    this.cardExpiryElement = elements.create("cardExpiry", { style });
    this.cardCvcElement = elements.create("cardCvc", { style });

    this.cardNumberElement.mount("#card-number");
    this.cardExpiryElement.mount("#card-expiry");
    this.cardCvcElement.mount("#card-cvc");

    this.cardNumberElement.on("change", (event) => {
      this.errorMessage.cardNumber = event.error ? event.error.message : "";
    });

    this.cardExpiryElement.on("change", (event) => {
      this.errorMessage.cardExpiry = event.error ? event.error.message : "";
    });

    this.cardCvcElement.on("change", (event) => {
      this.errorMessage.cardCvc = event.error ? event.error.message : "";
    });
  }

  invalid() {
    return (
      !this.name ||
      !!this.errorMessage.name ||
      !!this.errorMessage.cardNumber ||
      !!this.errorMessage.cardExpiry ||
      !!this.errorMessage.cardCvc
    );
  }

  async onSubmit() {
    this.loadingSpin = await this.loadingController.create({
      message: "Por favor, aguarde...",
    });
    await this.loadingSpin.present();
    this.disabled = true;
    this.stripe.createToken(this.cardNumberElement).then((response) => {
      if (response.error) {
        this.errorMessage.cardNumber = response.error.message;
        this.disabled = false;
        this.loadingSpin.dismiss();
        return;
      }

      this.http
        .post(environment.nodeJsApi + "charge", {
          token: response.token.id,
          name: this.name,
          amount: this.totalService,
        })
        .subscribe(
          (response: any) => {
            this.confirmarOrden();
            // this.resetForm();
          },
          (error) => {
            if (error.status === 400) {
              this.disabled = false;
              this.loadingSpin.dismiss();
              this.presentAlert(error.error.message, false);
            }
          }
        );
    });
  }

  ionViewDidEnter() {
    this.setUIBackButtonAction();
  }
  setUIBackButtonAction() {
    this.backButton.onClick = () => {
      this.cancel();
    };
  }

  async loadForm() {
    this.amount = 0;
    this.client = await this.storage.get("user");
    console.log("client info", this.client);
    if (this.selection != null) {
      this.selectedWorkersAmount = [];
      let cont = 0;
      for (const wo of this.selection.selWorkers) {
        this.selectedWorkersAmount[cont] = new PaymentResumeDTO(
          wo.fullNameWorker,
          "$" +
            (
              Math.round(wo.hourlyRate * this.selection.selDuration * 100) / 100
            ).toFixed(2),
          false
        );
        cont = cont + 1;
        this.amount = this.amount + wo.hourlyRate * this.selection.selDuration;
      }
      this.selectedWorkersAmount[cont] = new PaymentResumeDTO(
        "<b>Sub-Total</b>",
        "<b>$" +
          (Math.round(this.amount * 100) / 100).toFixed(2) +
          '* <span style="color:#D95A2B !important; font-weight: bold !important;">Amount will be paid directly to each worker</span></b>',
        true
      );
      this.totalService = this.feePerWorker * this.selection.selWorkers.length;
      this.selectedWorkersAmount[cont + 1] = new PaymentResumeDTO(
        "Total Finders Fees",
        "$" +
          (Math.round(this.totalService * 100) / 100).toFixed(2) +
          ' <span style="color:#D95A2B !important; font-weight: bold !important;">($' +
          this.feePerWorker +
          " per worker)</span></b>",
        false
      );
      this.total = this.totalService + Number(this.amount);
      this.selectedWorkersAmount[cont + 2] = new PaymentResumeDTO(
        "<b>Total Amount Due</b>",
        "<b>$" +
          (Math.round(this.totalService * 100) / 100).toFixed(2) +
          "</b>",
        true
      );
      this.loaded = true;
    } else {
      this.presentAlert("Could not load order information.", false);
      this.nav.navigateForward("home");
    }
  }

  goBack() {
    this.nav.navigateForward("home");
  }

  async confirmarOrden() {
    let workersDet: WorkOrderWorker[] = [];
    let cont = 0;
    for (const workerTmp of this.selection.selWorkers) {
      const detTmp: WorkOrderWorker = {
        workerName: workerTmp.fullNameWorker,
        hours: this.selection.selDuration,
        feePerWorker: 10,
        hourlyRate: workerTmp.hourlyRate,
      };
      workersDet[cont] = detTmp;
      cont = cont + 1;
    }
    const confirm: WorkOrders = {
      id: null,
      clientId: this.client.id,
      occupationId: 1,
      address: this.selection.selAddress,
      latitude: this.client.latitude,
      longitude: this.client.longitude,
      zipCode: this.selection.selZipCode,
      description: this.selection.selDescription,
      proposedDate: this.selection.selDate,
      estimatedDate: this.selection.selDate,
      needVehicle: this.selection.selVehicle,
      status: "IN_PROGRESS",
      durationInHours: this.selection.selDuration,
      orderWorkersAmount: null,
      orderXjobsFee: null,
      orderDiscount: null,
      totalAmount: null,
      workers: workersDet,
    };
    console.log("creación de OT", confirm);
    let newOrderId = 0;
    const newOrderCreated = await this.createOrder(confirm).toPromise();
    newOrderId = newOrderCreated["id"];
    this.imageSlider.temp = false;

    try {
      this.imageSlider.prepareFilesToUpload(
        newOrderId,
        false,
        false,
        this.token.token
      );
    } catch (e) {
      console.log("Error al cargar imagenes");
    }

    await this.delay(2000);
    console.log("Nueva orden: ", JSON.stringify(newOrderCreated));
    for (const workerTmp of this.selection.selWorkers) {
      const newAssing: WoAssigned = {
        workOrderId: newOrderId,
        workerId: workerTmp.workerId,
        proposedDate: this.selection.selDate,
        startTime: null,
        finishTime: null,
        workerComments: null,
        workOrderRate: null,
        clientComments: this.selection.selDescription,
        status: "NEW",
        occupationId: workerTmp.occupationId,
        durationInHours: this.selection.selDuration,
        orderWorkerAmount: workerTmp.hourlyRate,
        orderXjobsFee: null,
        orderDiscount: null,
        totalAmount: null,
      };
      const newAssingned = await this.createAssigmet(newAssing).toPromise();
      console.log("nueva asignacion: ", JSON.stringify(newAssingned));
    }
    this.loadingSpin.dismiss();
    this.presentAlert("Order successfully registered.", false);
    this.nav.navigateForward("home");
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public createOrder(newOrder: WorkOrders): Observable<any> {
    return this.backendService.insertEntity(
      "workOrders",
      newOrder,
      this.token.token
    );
  }

  public createAssigmet(newAssing: WoAssigned): Observable<any> {
    return this.backendService.insertEntity(
      "woAssigned",
      newAssing,
      this.token.token
    );
  }

  async presentAlert(messageAn: any, back: boolean) {
    const alert = await this.alertController.create({
      header: "Job Exchange",
      subHeader: "Payment",
      message: messageAn,
      buttons: ["OK"],
    });

    await alert.present();

    if (back) {
      this.nav.navigateForward("/results");
    }
  }

  async cancel() {
    const alert = await this.alertController.create({
      header: "Job Exchange",
      subHeader: "Search Engine",
      message: "Are you sure you want to cancel?",
      buttons: [
        {
          text: "No",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          },
        },
        {
          text: "Yes",
          handler: () => {
            this.router.navigate(["/list-workers-map"]);
          },
        },
      ],
    });

    await alert.present();
  }

  onGetRowClass = (row) => {
    if (row.isTotal) {
      return "total";
    }
  };
}
