import { SharedModule } from "src/app/components/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { Geolocation } from "@capacitor/geolocation/ngx";
import { IonicModule } from "@ionic/angular";
import { RegisterUser2Page } from "./register-user2.page";

const routes: Routes = [
  {
    path: "",
    component: RegisterUser2Page,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [RegisterUser2Page],
  providers: [],
})
export class RegisterUser2PageModule {}
