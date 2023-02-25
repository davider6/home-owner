import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import {
  AlertController,
  NavController,
  LoadingController,
} from "@ionic/angular";
import { Occupations } from "../../model/bo/Occupations";
import { BackendService } from "../../api/backend/backend.service";
import { WorkerOccupationDTO } from "../../model/dto/WorkerOcuppationDTO";
import { RequestFields } from "../../model/bo/RequestFields";
import { WorkOrderService } from "../../api/workOrder/work-orders.services";
import { HttpClient } from "@angular/common/http";
import { ImageSliderComponent } from "../../components/image-slider/image-slider.component";
import { WorkOrderHistoryDTO } from "../../model/dto/WorkOrderHistoryDTO";
const MEDIA_FOLDER_NAME = "new_orders";

@Component({
  providers: [ImageSliderComponent],
  selector: "app-new-order",
  templateUrl: "./new-order.page.html",
  styleUrls: ["./new-order.page.scss"],
})
export class NewOrderPage implements OnInit {
  occupationsList: Occupations[];
  workerOccupationList: WorkerOccupationDTO[];
  newOrder: WorkerOccupationDTO;
  needVehicle: boolean = false;

  constructor(
    private wos: WorkOrderService,
    private nav: NavController,
    private alertController: AlertController,
    private backendService: BackendService,
    private http: HttpClient,
    private ref: ChangeDetectorRef,
    private imageSlider: ImageSliderComponent,
    private loadingController: LoadingController
  ) {
    this.backendService
      .getItemsByMethod(
        "cache",
        "occupations",
        null,
        sessionStorage.getItem("token")
      )
      .subscribe(
        (resp) => {
          this.occupationsList = resp as Occupations[];
        },
        (error2) => {
          console.error(JSON.stringify(error2));
        }
      );
  }

  ngOnInit() {}

  // deleteFile(f: FileEntry) {
  //   const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf("/") + 1);
  //   this.file.removeFile(path, f.name).then(
  //     () => {
  //       this.loadImages();
  //     },
  //     err => console.log("error remove: ", err)
  //   );
  // }

  loadWorker(selected: number) {
    if (selected) {
      const reqField: RequestFields[] = [
        { fieldName: "parentComponentId", fieldValue: selected + "" },
      ];
      this.backendService
        .getItemsByMethod(
          "workerOcuppations",
          "workerOcuppationsByOccupationId",
          reqField,
          sessionStorage.getItem("token")
        )
        .subscribe(
          (resp) => {
            this.workerOccupationList = resp as WorkerOccupationDTO[];
          },
          (error2) => {
            console.error(JSON.stringify(error2));
          }
        );
    }
  }

  async createNewOrder(form: any) {
    const {
      address = "",
      estimatedDate = "",
      fullName = "",
      occupationsId = "",
      description = "",
      proposedDate = "",
    } = { ...form.value };
    if (occupationsId == "") {
      this.presentAlert("No ha seleccionado ninguna ocupacion.", false);
    } else if (fullName == "") {
      this.presentAlert("No ha ingresado su nombre.", false);
    } else if (address == "") {
      this.presentAlert("No ha ingresado su direccion.", false);
    } else if (description == "") {
      this.presentAlert(
        "No ha ingresado la descripcion de lo que necesita.",
        false
      );
    } else if (proposedDate == "") {
      this.presentAlert(
        "No ha ingresado la fecha ha realizar el servicio.",
        false
      );
    } else if (estimatedDate == "") {
      this.presentAlert("No ha ingresado la duracion del trabajo.", false);
    } else {
      const newOrder = {
        clientId: 1,
        occupationId: occupationsId,
        address,
        description,
        proposedDate,
        estimatedDate,
        needVehicle: this.needVehicle,
        status: "IN_PROGRESS",
      };
      const loading = await this.loadingController.create({
        message: "Uploading image...",
      });
      await loading.present();
      this.http.post(this.wos.URL_SERVICE, newOrder).subscribe(
        async (data) => {
          const a = await this.imageSlider.prepareFilesToUpload(
            data["id"],
            false,
            false,
            ""
          );
          loading.dismiss();
          this.presentAlert(
            "Su registro ha sido recibido exitosamente, pronto nos pondremos en contacto contigo.",
            true
          );
        },
        (error) => this.presentAlert(error, false)
      );
    }
  }

  async presentAlert(message: any, back: boolean) {
    const alert = await this.alertController.create({
      header: "New Work Order",
      subHeader: "Job Exchange",
      message,
      buttons: ["OK"],
    });

    await alert.present();

    if (back) this.nav.navigateForward("/home");
  }
}
