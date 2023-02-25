import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NavController, Platform } from "@ionic/angular";

import { BackendService } from "src/app/api/backend/backend.service";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { Geolocation } from "@awesome-cordova-plugins/geolocation/ngx";
import { AndroidPermissions } from "@awesome-cordova-plugins/android-permissions/ngx";
import { LocationAccuracy } from "@awesome-cordova-plugins/location-accuracy/ngx";
import { GoogleMap } from "@angular/google-maps";

declare var google: any;

@Component({
  selector: "app-address-selector",
  templateUrl: "./address-selector.page.html",
  styleUrls: ["./address-selector.page.scss"],
})
export class AddressSelectorPage implements OnInit {
  // MAPA

  address: string = "";
  zipCode: string = "";
  latitude: number;
  longitude: number;

  param: string;

  search: string = "";
  private googleAutocomplete = new google.maps.places.AutocompleteService();
  searchResults = new Array<any>();
  private geocoder = new google.maps.Geocoder();

  socialUser = {};

  center: google.maps.LatLngLiteral;
  zoom = 15;
  marker: any;
  lat;
  lng;
  location_found = false;

  loading = true;

  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  constructor(
    private service: BackendService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    public zone: NgZone,
    private geolocation: Geolocation,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy
  ) {
    this.route.params.subscribe((data) => {
      this.param = data.code;
    });
  }

  // ionViewWillEnter() {
  //   this.getMyLocation();
  // }

  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.socialUser = this.router.getCurrentNavigation().extras.state.user;
      }
    });
    // this.initMap();
    this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
      )
      .then(
        (result) => {
          if (result.hasPermission) {
            //If having permission show 'Turn On GPS' dialogue
            this.askToTurnOnGPS();
          } else {
            //If not having permission ask for permission
            this.requestGPSPermission();
          }
        },
        (err) => {
          alert(err);
        }
      );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions
          .requestPermission(
            this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
          )
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            (error) => {
              //Show alert if user click on 'No Thanks'
              alert("Error requesting location permissions " + error);
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy
      .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
      .then(
        () => {
          // When GPS Turned ON call method to get Accurate location coordinates
          this.getMyLocation();
        },
        (error) =>
          alert("Error requesting location permissions " + error.message)
      );
  }

  getMyLocation() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;
        this.initMap();
      })
      .catch((error) => {
        window.alert("Required Location Permission.");
      });
  }

  initMap() {
    this.location_found = true;
    this.center = {
      lat: this.lat,
      lng: this.lng,
    };
    // add address marker

    let icon = {
      url: "/assets/location/casa.png", // url
      scaledSize: new google.maps.Size(50, 50), // scaled size
      // origin: new google.maps.Point(0, 0), // origin
      // anchor: new google.maps.Point(0, 0), // anchor
    };

    this.marker = {
      position: {
        lat: this.lat,
        lng: this.lng,
      },
      label: {
        color: "red",
      },
      options: {
        icon: icon,
      },
    };
    this.getAddress();
  }

  getAddress() {
    this.service.getGeocodingInfo(`${this.lat},${this.lng}`).subscribe(
      (resp: any) => {
        let myAddress: string = resp.results[0].formatted_address;
        let myZipCode: string = "0";

        resp.results[0].address_components.forEach((element) => {
          if (element.types.length > 0 && element.types[0] == "postal_code") {
            myZipCode = element.short_name;
          }
        });

        this.actualizarInputs(myAddress, myZipCode);
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  updatePosition() {
    this.lat = this.map.getCenter().lat();
    this.lat = this.map.getCenter().lat();
    this.marker = {
      position: this.map.getCenter(),
    };
    this.getAddress();
  }

  actualizarInputs(myAddress: string, myZipCode: string) {
    this.address = myAddress;
    this.zipCode = myZipCode;
    this.changeDetectorRef.detectChanges(); // Trigger change detection
  }

  searchChanged() {
    if (!this.search.trim().length) return;

    this.googleAutocomplete.getPlacePredictions(
      { input: this.search },
      (predictions) => {
        this.zone.run(() => {
          this.searchResults = predictions;
        });
      }
    );
  }

  calcRoute(item: any) {
    this.search = "";

    this.geocoder.geocode({ placeId: item.place_id }, (results, status) => {
      if (status !== "OK") {
        window.alert("Geocoder failed due to: " + status);
        return;
      }
      console.log(results);
      console.log(results[0].geometry.location.lat());
      this.lat = results[0].geometry.location.lat();
      this.lng = results[0].geometry.location.lng();
      this.initMap();
    });
  }

  closeModal(parameters: boolean) {
    let destiny: string;

    if (this.param == "new") {
      destiny = "/register-user2/new";
    } else if (this.param == "social-new") {
      destiny = "/register-user2/social-new";
    } else {
      destiny = "/selection";
    }

    if (parameters) {
      let navigationExtras: NavigationExtras = {
        state: {
          address: this.address,
          zipCode: this.zipCode,
          latitude: this.lat,
          longitude: this.lng,
          socialUser: this.socialUser,
        },
      };

      console.log("navigationExtras", navigationExtras);

      this.router.navigate([destiny], navigationExtras);
    } else {
      console.log("me voy sin extras");
      this.router.navigate([destiny]);
    }
  }
}
