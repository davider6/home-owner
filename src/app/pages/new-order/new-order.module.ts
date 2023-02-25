import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

import { NewOrderPage } from "./new-order.page";
import { SharedModule } from "src/app/components/shared.module";

const routes: Routes = [
  {
    path: "",
    component: NewOrderPage
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
  declarations: [NewOrderPage]
})
export class NewOrderPageModule {}
