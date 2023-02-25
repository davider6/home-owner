import { Component, OnInit } from "@angular/core";
import { BackendService } from "../../../api/backend/backend.service";
import { WorkOrderHistoryDTO } from "../../../model/dto/WorkOrderHistoryDTO";
import { RequestFields } from "../../../model/bo/RequestFields";
import { Occupations } from "src/app/model/bo/Occupations";

import { Router, NavigationExtras } from "@angular/router";
@Component({
  selector: "app-history",
  templateUrl: "./history.page.html",
  styleUrls: ["./history.page.scss"],
})
export class HistoryPage implements OnInit {
  urlStr = "/order-detail/requested";

  orders: WorkOrderHistoryDTO[] = [];
  occupationsList: Occupations[];
  loaded = false;

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
      .getItemsByMethod("workOrders", "workClosedOrdersByClientId", reqField, sessionStorage.getItem('token'))
      .toPromise()
      .then(
        (resp) => {
          this.orders = resp as WorkOrderHistoryDTO[];
          this.orders.forEach((wo) => {
            const occupationSelected = this.occupationsList.filter(
              (occupation) => occupation.id === wo.occupationId
            );
            wo.occupation = occupationSelected[0]["name"];
            wo.occupationAvatar = occupationSelected[0]["categoryImage"];

            if (wo.status === "FINISHED") {
              wo.statusColor = "primary";
              wo.status = "Finished";
            } else if (wo.status === "REJECTED") {
              wo.statusColor = "danger";
              wo.status = "Rejected";
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
