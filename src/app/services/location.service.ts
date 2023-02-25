import { Injectable } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { Geolocation } from "@awesome-cordova-plugins/geolocation/ngx";
import { Diagnostic } from "@capacitor/diagnostic/ngx";

@Injectable({
  providedIn: "root",
})
export class LocationService {
  constructor(
    private geolocation: Geolocation,
    private diagnostic: Diagnostic,
    private alertController: AlertController
  ) {}

  getMyLocation() {
    return new Promise((resolve) => {
      // check if app has permission to access location
      this.diagnostic
        .isLocationAuthorized()
        .then((canAccess) => {
          if (canAccess) {
            // check if location is enabled
            this.diagnostic
              .isLocationEnabled()
              .then(async (isEnabled) => {
                if (isEnabled) {
                  // get current location
                  this.geolocation
                    .getCurrentPosition()
                    .then((resp) => {
                      resolve(resp);
                      // resp.coords.latitude;
                      // resp.coords.longitude;
                    })
                    .catch((error) => {
                      this.presentAlert(
                        "<strong>Error requesting location</strong></br></br>" +
                          error
                      );
                    });
                } else {
                  if (
                    await this.presentAlert(
                      "<strong>Please enable location service</strong>"
                    )
                  ) {
                    // open location setting
                    this.diagnostic.switchToLocationSettings();
                  }
                }
              })
              .catch((error) => {
                this.presentAlert(
                  "</strong>Error requesting location</strong></br></br>" +
                    error
                );
              });
          } else {
            this.presentAlert(
              "<strong>Error requesting location permissions</strong></br></br> Please allow permission for this app to access your location"
            );
          }
        })
        .catch((error) => {
          this.presentAlert(
            "<strong>Error requesting location permissions</strong></br></br> " +
              error
          );
        });
    });
  }

  async presentAlert(message) {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header: "Job Exchange",
        subHeader: "Search Engine",
        message: message,
        buttons: [
          {
            text: "OK",
            handler: () => {
              return resolve(true);
            },
          },
        ],
      });
      await alert.present();
    });
  }
}
