import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BackendService } from '../../api/backend/backend.service';

@Component({
  selector: 'app-forgot-mail',
  templateUrl: './forgot-mail.page.html',
})
export class ForgotMailPage implements OnInit {

  constructor( private router: Router,
               private apiService: BackendService,
               private alertController: AlertController,
               private ionicStorage: Storage) {
                this.start();
  }

  client: any;

  ngOnInit() {
  }

  async start() {
    this.client = await this.ionicStorage.get("user");
  }

  async presentAlert( message: any ) {
    const alert = await this.alertController.create({
      header: 'Password Change',
      subHeader: 'Jobs Exchange',
      message: message,
      buttons: ['OK']
    });

    await alert.present();

  }

  signInWithEmail( form: any ) {
    if ( form.value.password === '' ){
      this.presentAlert(
        `Debe ingresar contraseña nueva.`
      );
    } else if ( form.value.confirmation === '' ) {
      this.presentAlert(
        `Debe ingresar confirmacion de contraseña.`
      );
    }  else if ( form.value.password ==! form.value.confirmation ) {
      this.presentAlert(
        `Las contraseñas deben coincidir.`
      );
    } else {

      let passReset = {
        'clientId': this.client.id,
        'password': form.value.password
      };
      this.apiService.postEvent(
        passReset,
        'changePassword'
      )
      .subscribe( (response: any) => {
        if (response.isValid) {
          this.presentAlert('Password Changed.');
          this.router.navigate(['/home']);
        } else {
          this.presentAlert(response.errorMessage);
        }
      },
      error => {
        console.log('error en login', error);
      });
    }
  }

}
