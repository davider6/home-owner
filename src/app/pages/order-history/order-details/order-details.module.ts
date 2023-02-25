import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

import { OrderDetailsPage } from "./order-details.page";
import { SharedModule } from "src/app/components/shared.module";

const routes: Routes = [
  {
    path: "",
    component: OrderDetailsPage,
    children: []
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderDetailsPage]
})
export class OrderDetailsPageModule {}
