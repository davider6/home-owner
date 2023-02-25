import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation/ngx';
import { Storage } from '@ionic/storage';
import { AlertController, IonSlides, Platform } from '@ionic/angular';
import { MediaCapture } from '@capacitor/media-capture/ngx';
import { AndroidPermissions } from '@capacitor/android-permissions/ngx';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  latitude: any;
  longitude: any;
  step: number = 0;

  @ViewChild('welcomeSlider', { static: true }) slider: IonSlides;

  constructor(private router: Router,
              private geolocation: Geolocation,
              private ionicStorage: Storage,
              private alertController: AlertController,
              private platform: Platform,
              private androidPermissions: AndroidPermissions) {
              }

  ngOnInit() {
  }

  location() {
    this.geolocation.getCurrentPosition().then((res: any) => {
      console.log('getCurrentPosition',res);
      this.latitude = res.coords.latitude;
      this.longitude = res.coords.longitude;
      console.log(this.latitude+","+this.longitude);
      this.ionicStorage.set('lastLatitude', this.latitude.toString());
      this.ionicStorage.set('lastLongitude', this.longitude.toString());
    });
  }

  camera() {
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
          result => console.log('Has permission?', result.hasPermission),
          err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
        );

        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA]);
      });
    }
    // this.mediaCapture
    //       .captureImage()
    //       .then(
    //         this.mediaCapture = null          )
    //       .catch((err) =>
    //         console.error("error en la camara: ", err)
    //       );
  }

  storage() {
    // if (this.platform.is('cordova')) {
    //   this.platform.ready().then(() => {
    //     this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.).then(
    //       result => console.log('Has permission?', result.hasPermission),
    //       err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
    //     );

    //     this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA]);
    //   });
    // }
  }

  accept() {

    this.ionicStorage.set('welcomepage', true);
    this.router.navigate(['/login']);
  }

  async presentAlert(messageAn: any) {
    const alert = await this.alertController.create({
      header: "Job Exchange",
      subHeader: "Search Engine",
      message: messageAn,
      buttons: ["OK"],
    });

    await alert.present();
  }

  slideChanged() {
    // this.slider.lockSwipeToPrev(true).then((res2) => {
    //   this.slider.getActiveIndex().then((res) => {
    //     if (res === 2) {
    //       this.location();
    //     } else if (res === 3) {
    //       this.camera();
    //     } else if (res === 4) {
    //       this.storage();
    //     }
    //   });
    // });
  }

  async next(){

    this.step = this.step + 1;
    console.log('moviendose hacia: '+this.step);

    if (this.step === 2) {
      await this.location();
    } else if (this.step === 3) {
      await this.camera();
    } else if (this.step === 4) {
      await this.storage();
    }


    this.slider.lockSwipes(false);
    await this.slider.slideTo(this.step);
    this.slider.lockSwipes(true);
  }

  async previous(){

    this.step = this.step -1;
    console.log('moviendose hacia: '+this.step);

    this.slider.lockSwipes(false);
    await this.slider.slideTo(this.step);
    this.slider.lockSwipes(true);
  }

}
