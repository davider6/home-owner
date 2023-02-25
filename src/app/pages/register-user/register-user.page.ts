import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { BackendService } from '../../api/backend/backend.service';
import { Clients } from '../../model/bo/Clients';
import { TemporalClient } from '../../model/bo/TemporalClient';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.page.html',
  styleUrls: ['./register-user.page.scss'],
})
export class RegisterUserPage implements OnInit {

  order = false;
  tempId: string;

  registerForm: FormGroup;

  constructor(private router: Router,
              private actRoute: ActivatedRoute,
              private nav: NavController,
              private backendService: BackendService,
              private alertController: AlertController) {
    const paramOrd = this.actRoute.snapshot.paramMap.get('order');
    this.tempId = this.actRoute.snapshot.paramMap.get('tempId');
  }

  ngOnInit() {
  }

  register(form) {
    const emailAd = form.value['email'];
    const name = form.value['name'];
    const zip = form.value['zip'];
    const npassword = form.value['password'];
    const confirm = form.value['confirm'];

    if (!this.isEmail(emailAd)) {
      this.presentAlert('Formato correo incorrecto.', false);
      return;
    }

    if (npassword.length < 8) {
      this.presentAlert('Contraseña debe contener minimo 8 caracteres.', false);
      return;
    }

    if (npassword !== confirm) {
      this.presentAlert('Contraseña de confirmación no coincide.', false);
      return;
    }
    const newClient: Clients = {
      id: null,
      fullName: name,
      email: emailAd,
      status: false,
      zipCode: zip,
      address: null,
      longitude: null,
      latitude: null,
      clientPassword: npassword,
      type: 'N',
      externalId: null

    };
    this.backendService.insertEntity('clients', newClient, sessionStorage.getItem('token')).subscribe(
      respv2 => {
          const clientSave = respv2 as Clients;
          const tmpClient: TemporalClient = {
            id: clientSave.id,
            newOrderTempId: + this.tempId
          };
          this.backendService.insertEntity('temporalClient', tmpClient, sessionStorage.getItem('token')).subscribe(
            respv3 => {
              this.presentAlert('Usuario registrado con exito.', false);
              this.router.navigateByUrl('home');
            }, error2 => {
              this.presentAlert('Ocurrio un error al registrar usuario.', false);
              console.error(JSON.stringify(error2));
            }
          );
      }, error2 => {
          this.presentAlert('Ocurrio un error al registrar usuario.', false);
          console.error(JSON.stringify(error2));
        }
      );
    console.log('Datos validos');
  }

  isEmail(email: string): boolean {
    let serchfind: boolean;
    const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    serchfind = regexp.test(email);
    return serchfind;
  }

  async presentAlert(messageAn: any, back: boolean) {
    const alert = await this.alertController.create({
      header: 'Expert Jobs',
      subHeader: 'Registro de Usuario',
      message: messageAn,
      buttons: ['OK']
    });

    await alert.present();

    if (back) {
      this.nav.navigateForward('/results');
    }
  }
}
