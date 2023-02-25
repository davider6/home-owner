import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";

import { Filesystem } from "@capacitor/filesystem";
import { Camera } from "@capacitor/camera";
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { MediaCapture } from "@awesome-cordova-plugins/media-capture";
import { DeleteModalPageModule } from "./pages/new-order/delete-modal/delete-modal.module";
import { OrderDetailsPageModule } from "./pages/order-history/order-details/order-details.module";
import { ImageProfilePipe } from "./pipes/image-profile.pipe";

import { IonicStorageModule } from "@ionic/storage";
import { AuthService } from "./services/auth.service";
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import { DatePipe } from "@angular/common";

import { Facebook } from '@awesome-cordova-plugins/facebook/ngx';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { AndroidPermissions } from "@awesome-cordova-plugins/android-permissions";


import { AddressSelectorPageModule } from "./pages/address-selector/address-selector.module";
import { ImageResizer } from "@awesome-cordova-plugins/image-resizer";
import { Diagnostic } from "@awesome-cordova-plugins/diagnostic";

export const firebaseConfig = {
  apiKey: "AIzaSyCinrx4tqUuECzn46SKiFpIlAoQo4AZado",
  authDomain: "xjobworker.firebaseapp.com",
  databaseURL: "https://xjobworker.firebaseio.com",
  projectId: "xjobworker",
  storageBucket: "xjobworker.appspot.com",
  messagingSenderId: "51878476605",
  appId: "1:51878476605:web:6341886b19fffc580de354",
};

@NgModule({
  declarations: [AppComponent, ImageProfilePipe],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    DeleteModalPageModule,
    OrderDetailsPageModule,
    IonicStorageModule.forRoot(),
    AddressSelectorPageModule,
  ],
  providers: [
    AuthService,
    DatePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
