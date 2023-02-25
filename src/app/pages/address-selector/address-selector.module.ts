import { NgModule } from "@angular/core";
import { GoogleMapsModule } from "@angular/google-maps";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Geolocation } from "@awesome-cordova-plugins/geolocation/ngx";
import { AndroidPermissions } from "@awesome-cordova-plugins/android-permissions/ngx";
import { LocationAccuracy } from "@awesome-cordova-plugins/location-accuracy/ngx";
import { IonicModule } from "@ionic/angular";
import { AddressSelectorPage } from "./address-selector.page";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    component: AddressSelectorPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoogleMapsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [AddressSelectorPage],
  providers: [Geolocation, AndroidPermissions, LocationAccuracy],
})
export class AddressSelectorPageModule {}
