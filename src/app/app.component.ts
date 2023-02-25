import {Component, OnInit} from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen/ngx';
import { StatusBar } from '@capacitor/status-bar/ngx';
import { Environment } from "@capacitor/google-maps";
import { PushService } from './services/push.service';
import { PROPS } from "./constants/properties";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private pushService: PushService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
  }

  initializeApp() {
    this.platform.ready().then(() => {

      Environment.setEnv({
        // api key for server
        'API_KEY_FOR_BROWSER_RELEASE': PROPS.googleMapsApiKey,
 
        // api key for local development
        'API_KEY_FOR_BROWSER_DEBUG': PROPS.googleMapsApiKey
      });

      this.statusBar.styleLightContent();
      this.statusBar.show();
      this.splashScreen.hide();
      this.pushService.initialConfiguration();
    });
  }
}
