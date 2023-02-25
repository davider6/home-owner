import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import {
  LoadingController,
  AlertController,
  NavController,
  ModalController,
} from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { SignService } from "../../services/sign.service";

import { BackendService } from "../../api/backend/backend.service";
import { PushService } from "../../services/push.service";
import { NullTemplateVisitor } from "@angular/compiler";
import { ClassGetter } from "@angular/compiler/src/output/output_ast";
import { Geolocation } from "@capacitor/geolocation/ngx";
import { AddressSelectorPageModule } from "../address-selector/address-selector.module";
import { AddressSelectorPage } from "../address-selector/address-selector.page";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-register-user2",
  templateUrl: "./register-user2.page.html",
  styleUrls: ["./register-user2.page.scss"],
})
export class RegisterUser2Page {
  public userForm: FormGroup;
  public needsPassword: boolean;
  public userInvalid: boolean;
  public loading: boolean;
  private loadingSpin;
  private OAuthProvider;
  private OAuthKey;

  public registerUserType: string;

  private latitude: number;
  private longitude: number;

  socialUser: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private backend: BackendService,
    public loadingController: LoadingController,
    private storage: Storage,
    private router: Router,
    private sign: SignService,
    private pushService: PushService,
    private geolocation: Geolocation,
    private alertController: AlertController,
    private navCtrl: NavController,
    private authService: AuthService
  ) {
    this.userInvalid = false;
    this.loading = false;

    this.route.params.subscribe((data) => {
      this.registerUserType = data.type;
      this.init().then();
    });

    this.obtieneCoordenadas();
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.socialUser =
          this.router.getCurrentNavigation().extras.state.socialUser;
        this.userForm.patchValue({
          address: this.router.getCurrentNavigation().extras.state.address,
          zip: this.router.getCurrentNavigation().extras.state.zipCode,
          email: this.socialUser.email,
          name: this.socialUser.name,
        });
      }
    });
  }

  async obtieneCoordenadas() {
    this.latitude = await this.storage.get("lastLatitude");
    this.longitude = await this.storage.get("lastLongitude");

    if (this.latitude == null || this.longitude == null) {
      this.geolocation.getCurrentPosition().then((res) => {
        this.latitude = res.coords.latitude;
        this.longitude = res.coords.longitude;
        this.storage.set("lastLatitude", this.latitude);
        this.storage.set("lastLongitude", this.latitude);
      });
    }
  }

  async init() {
    if (this.registerUserType === "new") {
      this.needsPassword = true;
      this.createFormPassword();
    } else if (this.registerUserType === "social-new") {
      this.needsPassword = false;
      this.createForm();
      // await this.prepareOAuth();
    } else {
      this.needsPassword = false;
      this.createForm();
    }
  }

  createFormPassword() {
    this.userForm = this.formBuilder.group(
      {
        email: ["", [Validators.required, Validators.email]],
        name: ["", [Validators.required, Validators.minLength(3)]],
        address: ["", [Validators.required]],
        zip: [
          "",
          [
            Validators.required,
            Validators.minLength(4),
            Validators.pattern("^[0-9]+$"),
          ],
        ],
        password: ["", [Validators.required, Validators.minLength(5)]],
        password2: ["", [Validators.required, Validators.minLength(5)]],
      },
      {
        validators: this.checkPasswords,
      }
    );
  }

  createForm() {
    this.userForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      name: ["", [Validators.required, Validators.minLength(3)]],
      address: ["", [Validators.required]],
      zip: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern("^[0-9]+$"),
        ],
      ],
    });
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get("password").value;
    let confirmPass = group.get("password2").value;
    return pass === confirmPass ? null : { notSame: true };
  }

  get passwordValid() {
    return (
      this.userForm.hasError("notSame") &&
      this.userForm.get("password").touched &&
      this.userForm.get("password2").touched
    );
  }

  async prepareOAuth() {
    const userOAuth = await this.sign.saveWebTokenOAuth();
    this.OAuthKey = this.sign.OAuthKey(userOAuth.sub);
    this.OAuthProvider = this.sign.OAuthProvider(userOAuth.sub);
    if (
      await this.sign.userExistsTokenOAuth(this.OAuthKey, this.OAuthProvider)
    ) {
      await this.sign.logout("user-exists");
      return;
    } else {
      this.userForm.get("email").setValue(userOAuth.email);
      this.userForm.get("name").setValue(userOAuth.name);
    }
    return;
  }

  async saveUser() {
    if (this.userForm.valid) {
      this.loadingSpin = await this.loadingController.create({
        message: "Validando el usuario...",
      });
      await this.loadingSpin.present();
      this.loading = true;
      let newUser = null;
      let type = null;
      if (this.registerUserType === "new") {
        newUser = this.buildInternalUser();
        type = "I";
        this.postUser(newUser, type);
      } else if (this.registerUserType === "social-new") {
        let user = {
          email: this.userForm.get("email").value,
          name: this.userForm.get("name").value,
          type: this.socialUser.type,
          picture: this.socialUser.picture,
          address: this.userForm.get("address").value,
          zipCode: this.userForm.get("zip").value,
          latitude: this.latitude,
          longitude: this.longitude,
        };
        this.backend
          .postExternalUser(
            user,
            this.socialUser.externalId,
            this.socialUser.type
          )
          .toPromise()
          .then((res) => {
            let data = {
              type: this.socialUser.type,
              username: this.socialUser.externalId,
              provider: this.socialUser.provider,
            };
            let auth = {
              entity: "C",
              type: this.socialUser.type,
              username: this.socialUser.externalId,
              deviceId: this.pushService.deviceId,
            };

            this.backend.postEvent(auth, "auth").subscribe(
              (login: any) => {
                this.storage.set("token", login);
                this.storage.set("userId", login.clientId);

                this.backend
                  .getEvent(`clients/${login.clientId}`, login.token)
                  .subscribe(
                    (usr) => {
                      this.authService.cargarUsuario(
                        usr["fullName"],
                        usr["email"],
                        usr["profileImage"],
                        this.socialUser.externalId,
                        this.socialUser.provider
                      );
                      this.loadingSpin.dismiss();
                      console.log("almacenando en el storage F", usr);
                      this.storage.set("user", usr);

                      this.router.navigate(["/home"]);
                    },
                    (err) => {
                      this.loadingSpin.dismiss();
                      this.presentAlert(
                        `Error obteniendo información del usuario.`,
                        false
                      );
                      this.loading = false;
                    }
                  );
              },
              (error) => {
                this.loadingSpin.dismiss();
                this.presentAlert(`error en login.`, false);
                this.loading = false;
              }
            );
          })
          .catch((error) => {
            this.loadingSpin.dismiss();
            this.presentAlert(`El correo ya existe.`, false);
            this.loading = false;
          });
      }
    }
  }

  buildExternalUser() {
    return {
      email: this.userForm.get("email").value,
      name: this.userForm.get("name").value,
      address: this.userForm.get("address").value,
      zipCode: this.userForm.get("zip").value,
      type: this.OAuthProvider,
      tokenKey: this.OAuthKey,
      latitude: this.latitude,
      longitude: this.longitude,
      status: true,
    };
  }

  buildInternalUser() {
    return {
      email: this.userForm.get("email").value,
      name: this.userForm.get("name").value,
      address: this.userForm.get("address").value,
      zipCode: this.userForm.get("zip").value,
      password: this.userForm.get("password").value,
      type: "N",
      latitude: this.latitude,
      longitude: this.longitude,
      status: false,
    };
  }

  postUser(newUser, type) {
    this.backend.postInternalUser(newUser).subscribe(
      async (response) => {
        this.loading = false;
        Object.assign(response, { entity: "C" });
        await this.storage.set("user", response);

        if (type == "I") {
          this.backend.cleanStorage();
          this.storage.clear();
          this.storage.set("welcomepage", true);
          this.loadingSpin.dismiss();
          this.presentAlert(
            `Successfully registered user. An email with instructions will be sent to your account ${
              this.userForm.get("email").value
            }`,
            false
          );
          this.router.navigate(["/login"]);
        } else {
          const token = await this.sign.getToken(
            newUser.email,
            newUser.password ? newUser.password : null,
            newUser.type,
            this.OAuthKey ? this.OAuthKey : NullTemplateVisitor,
            "C",
            this.pushService.deviceId
          );

          if (token.token) {
            await this.storage.set("token", token);
          }
          this.loadingSpin.dismiss();
          this.router.navigate(["/home"]);
        }
      },
      () => {
        this.userInvalid = true;
        this.loading = false;
        this.loadingSpin.dismiss();
      }
    );
  }

  deleteTokens() {
    this.storage.clear().then();
    this.router.navigate(["/sign", "home"]);
  }

  async presentAlert(message: any, back: boolean) {
    const alert = await this.alertController.create({
      header: "New Registration",
      subHeader: "Jobs Exchange",
      message: message,
      buttons: ["OK"],
    });

    await alert.present();

    if (back) this.router.navigate(["/home"]);
  }

  selectAddress() {
    this.navCtrl.back();
  }

  // async selectAddress() {

  //   this.isModal = true;

  //   const modal = await this.modalCtrl.create({
  //     component: AddressSelectorPage,
  //     componentProps: {
  //       origen: 'registro'
  //     }
  //   });

  //   await modal.present();

  //   const { data } = await modal.onDidDismiss();

  //   if (data!=null){
  //     this.isModal = true;
  //     this.userForm.patchValue({
  //       address: data.address,
  //       zip: data.zipCode
  //     });
  //   }

  // }
}
