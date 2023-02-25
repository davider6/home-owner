import { SharedModule } from "src/app/components/shared.module";
import { GoogleMapsModule } from "@angular/google-maps";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { Geolocation } from "@capacitor/geolocation/ngx";

import { IonicModule } from "@ionic/angular";

import { ListWorkersMapPage } from "./list-workers-map.page";

const routes: Routes = [
  {
    path: "",
    component: ListWorkersMapPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    GoogleMapsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ListWorkersMapPage],
  providers: [],
})
export class ListWorkersMapPageModule {}
