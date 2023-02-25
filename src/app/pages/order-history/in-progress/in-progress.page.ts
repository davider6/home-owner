import { Component, OnInit } from "@angular/core";
import { BackendService } from "../../../api/backend/backend.service";
import { WorkOrderHistoryDTO } from "../../../model/dto/WorkOrderHistoryDTO";
import { RequestFields } from "../../../model/bo/RequestFields";
import { Occupations } from "src/app/model/bo/Occupations";

import { Router, NavigationExtras } from "@angular/router";

@Component({
  selector: "app-in-progress",
  templateUrl: "./in-progress.page.html",
  styleUrls: ["./in-progress.page.scss"],
})
export class InProgressPage implements OnInit {
  orders: WorkOrderHistoryDTO[] = [];
  occupationsList: Occupations[];
  loaded = false;
  urlStr = "/in-progress2/requested2";

  constructor(private backendService: BackendService, private router: Router) {
    this.backendService.getAllFromEntity("occupations", sessionStorage.getItem('token')).subscribe(
      (resp) => {
        this.occupationsList = resp as Occupations[];
        this.loadOrders();
      },
      (error2) => {
        console.error(JSON.stringify(error2));
      }
    );
  }

  ngOnInit() {}

  loadOrders() {
    const reqField: RequestFields[] = [
      { fieldName: "clientId", fieldValue: sessionStorage.getItem("workerId") },
    ];
    this.backendService
      .getItemsByMethod("workOrders", "workOpenOrdersByClientId", reqField, sessionStorage.getItem('token'))
      .toPromise()
      .then(
        (resp) => {
          console.log(resp);
          this.orders = resp as WorkOrderHistoryDTO[];
          this.orders.forEach((wo) => {
            const occupationSelected = this.occupationsList.filter(
              (occupation) => occupation.id === wo.occupationId
            );
            wo.occupation = occupationSelected[0]["name"];
            wo.occupationAvatar = occupationSelected[0]["categoryImage"];

            if (wo.status === "IN_PROGRESS") {
              wo.statusColor = "success";
              wo.status = "In Progress";
            }
          });
          this.loaded = true;
        },
        (error2) => {
          console.error(JSON.stringify(error2));
        }
      );
  }

  updateData(event) {
    this.loaded = false;
    this.loadOrders();
    event.target.complete();
  }

  async openDetails(order) {
    const navigationExtras: NavigationExtras = {
      state: {
        order,
      },
    };
    this.router.navigate(["order-details"], navigationExtras);
  }
}
