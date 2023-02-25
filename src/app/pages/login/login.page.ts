import { Component, OnInit } from "@angular/core";

import * as firebase from "firebase/app";
import {
  NavController,
  AlertController,
  ActionSheetController,
  PopoverController,
  LoadingController,
} from "@ionic/angular";
import { AuthService } from "../../services/auth.service";
import { Router, NavigationExtras } from "@angular/router";

import { Platform } from "@ionic/angular";

import { GooglePlus } from "@capacitor/google-plus/ngx";
import { Storage } from "@ionic/storage";
import { AngularFireAuth } from "@angular/fire/auth";
import { BackendService } from "../../api/backend/backend.service";
import { PopemailComponent } from "../../components/popemail/popemail.component";
import { PushService } from "../../services/push.service";
import { SignService } from "../../services/sign.service";
import {
  Facebook,
  FacebookLoginResponse,
} from "@awesome-cordova-plugins/facebook/ngx";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  GOOGLE: string = "G";
  FACEBOOK: string = "F";
  EMAIL: string = "N";
  private loadingSpin;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private authService: AuthService,
    private fb: Facebook,
    private googlePlus: GooglePlus,
    private platform: Platform,
    private apiService: BackendService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private ionicStorage: Storage,
    public popoverController: PopoverController,
    public pushService: PushService,
    private sign: SignService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  async signInWithGoogle(registry: boolean = false) {
    this.apiService.cleanStorage();
    this.loadingSpin = await this.loadingController.create({
      message: "Por favor, aguarde...",
    });
    await this.loadingSpin.present();
    this.googlePlus
      .login({
        webClientId:
          "334125749584-f40n1bsn8ng19dij4bna9oh8ur5et4pv.apps.googleusercontent.com",
        offline: true,
      })
      .then((apiRes) => {
        this.apiService.externalExists(apiRes.userId, this.GOOGLE).subscribe(
          (resp) => {
            this.authService.cargarUsuario(
              apiRes.displayName,
              apiRes.email,
              apiRes.imageUrl,
              apiRes.userId,
              "google"
            );

            //existe en la plataforma
            if (resp["exists"]) {
              //si existe y se quiere loguear que pase adelante
              let data = {
                type: this.GOOGLE,
                username: apiRes.userId,
                provider: "google",
              };
              this.authenticateUser(data);
              //si no existe en la plataforma
            } else {
              let user = {
                email: apiRes.email,
                name: apiRes.displayName,
                type: this.GOOGLE,
                picture: apiRes.imageUrl,
                externalId: apiRes.userId,
                provider: "google",
              };
              this.loadingSpin.dismiss();
              this.registerUser(user);
            }
          },
          (err) => {
            this.loadingSpin.dismiss();
            this.presentAlert(err);
          }
        );
      })
      .catch((err) => {
        this.loadingSpin.dismiss();
        this.presentAlert(err);
      });
  }

  async signInWithFacebook(registry: boolean = false) {
    this.apiService.cleanStorage();
    this.loadingSpin = await this.loadingController.create({
      message: "Por favor, aguarde...",
    });
    await this.loadingSpin.present();
    this.fb
      .login(["email", "public_profile"])
      .then((logInRes: any) => {
        this.fb
          .getCurrentProfile()
          .then((profileRes) => {
            this.fb
              .api("/me?fields=email,picture.width(400).height(400)", ["email"])
              .then((apiRes) => {
                // this.test_img = res.picture.data.url;
                this.apiService
                  .externalExists(apiRes.id, this.FACEBOOK)
                  .subscribe(
                    (resp) => {
                      this.authService.cargarUsuario(
                        profileRes.firstName + " " + profileRes.lastName,
                        apiRes.email,
                        apiRes.picture.data.url,
                        apiRes.id,
                        "facebook"
                      );

                      //existe en la plataforma
                      if (resp["exists"]) {
                        //si existe y se quiere loguear que pase adelante
                        let data = {
                          type: this.FACEBOOK,
                          username: apiRes.id,
                          provider: "facebook",
                        };
                        this.authenticateUser(data);
                        //si no existe en la plataforma
                      } else {
                        let user = {
                          email: apiRes.email,
                          name:
                            profileRes.firstName + " " + profileRes.lastName,
                          type: this.FACEBOOK,
                          picture: apiRes.picture.data.url,
                          externalId: apiRes.id,
                          provider: "facebook",
                        };

                        this.loadingSpin.dismiss();
                        this.registerUser(user);
                      }
                    },
                    (err) => {
                      this.loadingSpin.dismiss();
                      this.presentAlert(err);
                    }
                  );
              })
              .catch((err) => {
                this.loadingSpin.dismiss();
                this.presentAlert(err);
              });
          })
          .catch((err) => {
            this.loadingSpin.dismiss();
            this.presentAlert(err);
          });
      })
      .catch((err) => {
        this.loadingSpin.dismiss();
        this.presentAlert(err);
      });
  }

  registerUser(user) {
    let navigationExtras: NavigationExtras = {
      state: {
        user,
      },
    };
    this.router.navigate(["/address-selector/social-new"], navigationExtras);
  }

  authenticateUser(params) {
    let auth = {
      entity: "C",
      type: params.type,
      username: params.username,
      deviceId: this.pushService.deviceId,
    };

    this.apiService.postEvent(auth, "auth").subscribe(
      (login: any) => {
        this.ionicStorage.set("token", login);
        this.ionicStorage.set("userId", login.clientId);

        this.apiService
          .getEvent(`clients/${login.clientId}`, login.token)
          .subscribe(
            (usr) => {
              this.authService.cargarUsuario(
                usr["fullName"],
                usr["email"],
                usr["profileImage"],
                params.username,
                params.provider
              );
              this.loadingSpin.dismiss();
              console.log("almacenando en el storage F", usr);
              this.ionicStorage.set("user", usr);

              this.router.navigate(["/home"]);
            },
            (err) => {
              this.loadingSpin.dismiss();
              this.presentAlert(`Error obteniendo información del usuario.`);
            }
          );
      },
      (error) => {
        this.loadingSpin.dismiss();
        this.presentAlert(`error en login.`);
      }
    );
  }

  async presentAlert(message: any) {
    const alert = await this.alertController.create({
      header: "Inicio de Sesión",
      subHeader: "Jobs Exchange",
      message: message,
      buttons: ["OK"],
    });

    await alert.present();
  }

  signInWithEmail(form: any) {
    this.apiService.cleanStorage();

    if (form.value.email === "") {
      this.presentAlert(`El email no ha sido ingresado.`);
    } else if (form.value.password === "") {
      this.presentAlert(`La contraseña no ha sido ingresada.`);
    } else {
      const token = this.sign.getToken(
        form.value.email,
        form.value.password,
        this.EMAIL,
        null,
        "C",
        this.pushService.deviceId
      );

      this.apiService
        .internalExists(
          form.value.email,
          form.value.password,
          this.EMAIL,
          this.pushService.deviceId
        )
        .subscribe((resp) => {
          if (resp["isValid"]) {
            let auth = {
              entity: "C",
              type: this.EMAIL,
              username: form.value.email,
              password: form.value.password,
              deviceId: this.pushService.deviceId,
            };

            this.apiService.postEvent(auth, "auth").subscribe(
              (login: any) => {
                this.ionicStorage.set("token", login);
                this.ionicStorage.set("userId", login.clientId);
                // this.apiService.saveStorage( 'auth-token', login.token );
                // this.apiService.saveStorage( 'userId', login.clientId );

                this.apiService
                  .getEvent(`clients/${login.clientId}`, login.token)
                  .subscribe(
                    (usr) => {
                      this.authService.cargarUsuario(
                        usr["fullName"],
                        form.value.email,
                        usr["profileImage"],
                        "",
                        "email"
                      );

                      console.log("almacenando en el storage N", usr);
                      this.ionicStorage.set("user", usr);

                      if (login.passwordReset) {
                        this.router.navigate(["/forgot-mail"]);
                      } else {
                        this.router.navigate(["/home"]);
                      }
                    },
                    (err) => {
                      console.log("Error obteniendo información del usuario");
                    }
                  );
              },
              (error) => {
                console.log("error en login", error);
              }
            );
          } else {
            this.presentAlert(`Usuario o contraseña inválido.`);
          }
        });
    }
  }

  signUp() {
    this.router.navigate(["/address-selector/new"]);
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Sing Up with us",
      cssClass: "action-sheets-groups-page",
      buttons: [
        {
          text: "Using an email",
          role: "destructive",
          icon: "mail",
          handler: () => {
            //console.log('E-mail clicked');
            this.router.navigate(["/address-selector/new"]);
          },
        },
        {
          text: "Using a Facebook account",
          icon: "logo-facebook",
          cssClass: "FacebookIcon",
          handler: () => {
            // console.log('Facebook clicked');
            this.signInWithFacebook(true);
          },
        },
        {
          text: "Using a Google account",
          icon: "logo-google",
          cssClass: "GoogleIcon",
          handler: () => {
            // console.log('Google clicked');
            this.signInWithGoogle(true);
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async forgotPasswordMail(ev: any) {
    const popover = await this.popoverController.create({
      component: PopemailComponent,
      event: ev,
      cssClass: "custom-popover",
    });
    return await popover.present();
  }
}
