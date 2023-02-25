import { LocationService } from "src/app/services/location.service";
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { BackendService } from "../../../api/backend/backend.service";
import { WorkerOccupationDTO } from "../../../model/dto/WorkerOcuppationDTO";
import { RequestFields } from "../../../model/bo/RequestFields";
import { Occupations } from "../../../model/bo/Occupations";
import {
  NavController,
  AlertController,
  IonSlides,
  IonCheckbox,
} from "@ionic/angular";
import { SelectionRequestDTO } from "../../../model/dto/SelectionRequestDTO";
import { Token } from "src/app/model/bo/Token";
import { Clients } from "src/app/model/bo/Clients";
import { Storage } from "@ionic/storage";
import { Platform } from "@ionic/angular";

import { from } from "rxjs";

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation,
} from "@capacitor/google-maps";

import { Geolocation } from "@capacitor/geolocation/ngx";
import { stringify } from "querystring";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-list-workers-map",
  templateUrl: "./list-workers-map.page.html",
  styleUrls: ["./list-workers-map.page.scss"],
})
export class ListWorkersMapPage implements OnInit {
  latitude: any;
  longitude: any;
  showMap: boolean = true;
  isLoaded: boolean = false;
  isCurrentPosition: boolean = false;
  principal: boolean;
  // MAPA
  map: GoogleMap;
  address: string;
  segment = 0;
  resources = 1;
  selectionRequestDTO: SelectionRequestDTO;
  workerOccupationsList: WorkerOccupationDTO[] = [];
  workerOccupationsMap = new Map();
  workersSelected: WorkerOccupationDTO[] = [];
  isCheckboxDisabled = false;
  isChecked: boolean[] = [];

  token: Token;
  client: Clients;
  loadingMarks: boolean;

  homeOwnerMark: Marker;

  colors: any[] = [
    "primary",
    "secondary",
    "success",
    "warning",
    "danger",
    "medium",
    "dark",
  ];

  location_found = false;
  center: google.maps.LatLngLiteral;
  markers = [];

  @ViewChild("slides", { static: false }) slider: IonSlides;
  constructor(
    private actRoute: ActivatedRoute,
    private nav: NavController,
    private backendService: BackendService,
    private router: Router,
    private alertController: AlertController,
    private storage: Storage,
    private geolocation: Geolocation,
    private platform: Platform,
    public datepipe: DatePipe,
    private locationService: LocationService
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      if (this.router.getCurrentNavigation().extras.state.latitude) {
        this.latitude =
          this.router.getCurrentNavigation().extras.state.latitude;
        this.longitude =
          this.router.getCurrentNavigation().extras.state.longitude;
      }
    }

    this.principal = true;
  }

  ngOnInit() {
    this.getWorkers();
  }

  getIndex(worker: WorkerOccupationDTO) {
    return this.workerOccupationsList.findIndex(
      (x) =>
        x.workerId === worker.workerId && x.occupationId === worker.occupationId
    );
  }
  // MAPA
  async segmentChanged() {
    if (this.loadingMarks) {
      this.slider.lockSwipes(true);
    } else {
      this.slider.lockSwipes(false);
      await this.slider.slideTo(this.segment);
      this.slider.lockSwipes(true);
    }
  }

  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }

  async goToMyLocation() {
    if (this.latitude) {
      this.center = {
        lat: this.latitude,
        lng: this.longitude,
      };
      this.location_found = true;
    } else {
      this.locationService.getMyLocation().then((resp: any) => {
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
        this.center = {
          lat: resp.coords.latitude,
          lng: resp.coords.longitude,
        };
        this.location_found = true;
      });
    }

    if (this.latitude) {
      let icon = {
        url: "/assets/location/casa.png", // url
        scaledSize: new google.maps.Size(50, 50), // scaled size
      };
      this.markers.push({
        position: {
          lat: this.latitude,
          lng: this.longitude,
        },
        options: {
          icon: icon,
        },
      });
    }

    // if (coordinates) {
    //   //add user mark
    //   if (!this.isCurrentPosition) {
    //     console.log("list worker map coordinates", coordinates);
    //     // Move the map camera to the location with animation
    //     this.map.moveCamera({
    //       target: coordinates,
    //       zoom: 13,
    //       tilt: 30,
    //     });
    //     this.isCurrentPosition = true;
    //     this.homeOwnerMark = this.map.addMarkerSync({
    //       title: "You're Here!",
    //       position: coordinates,
    //       animation: GoogleMapsAnimation.DROP,
    //       icon: "assets/location/casa.png",
    //     });
    //     this.homeOwnerMark.showInfoWindow();
    //   }
    // }
  }

  isLatitude(lat) {
    return isFinite(lat) && Math.abs(lat) <= 90;
  }

  isLongitude(lng) {
    return isFinite(lng) && Math.abs(lng) <= 180;
  }

  getWorkers() {
    this.loadingMarks = true;
    try {
      if (this.router.getCurrentNavigation().extras.state) {
        this.workersSelected = [];

        this.selectionRequestDTO =
          this.router.getCurrentNavigation().extras.state.order;
        console.log(
          "Objeto obtenido ",
          JSON.stringify(this.selectionRequestDTO)
        );
        const reqField: RequestFields[] = [
          {
            fieldName: "zipCode",
            fieldValue: this.selectionRequestDTO.selZipCode,
          },
          {
            fieldName: "hasVehicle",
            fieldValue: stringify(this.selectionRequestDTO.selVehicle),
          },
          {
            fieldName: "durationHours",
            fieldValue: this.selectionRequestDTO.selDuration.toString(),
          },
          {
            fieldName: "workDate",
            fieldValue: this.datepipe.transform(
              this.selectionRequestDTO.selDate,
              "yyyy-MM-dd"
            ),
          },
        ];

        for (const current of this.selectionRequestDTO.selSubCategories) {
          reqField.push({
            fieldName: "occupationsIds",
            fieldValue: current.occupationId.toString(),
          });
        }
        // console.log('request ocuppations: ', JSON.stringify(reqField));
        this.storage
          .get("token")
          .then((tk) => {
            // console.log("tkn: "+tk);
            this.token = tk;
            this.backendService
              .getItemsByMethod(
                "workerOcuppations",
                "workerOcuppationsEngine",
                reqField,
                this.token.token
              )
              .subscribe(
                async (resp) => {
                  //  console.log("workerOcuppationsEngine", resp);
                  this.workerOccupationsList = resp as WorkerOccupationDTO[];
                  if (this.workerOccupationsList.length === 0) {
                    // Incident # 0000038: Search Engine - resultados de zero deben mostrarse y mensaje debe ser emitido cuando no se encuentra ningún worker disponible
                    this.presentAlert(
                      "Unfortunately there are not any worker in your zone for the desired categories. Please try with another category ",
                      false
                    );
                    this.router.navigate(["/selection"]);
                  }
                  for (const current of this.selectionRequestDTO
                    .selSubCategories) {
                    const workerOccupationsList: WorkerOccupationDTO[] =
                      this.workerOccupationsList.filter(
                        (worker) => worker.occupationId === current.occupationId
                      );
                    if (workerOccupationsList) {
                      this.workerOccupationsMap.set(
                        current.occupationId,
                        workerOccupationsList
                      );
                    } else {
                      this.workerOccupationsMap.set(current.occupationId, []);
                    }
                  }
                  this.isChecked = this.workerOccupationsList.map((x) => true);
                  //console.log(this.isChecked);
                  this.workersSelected = [];
                  await this.goToMyLocation();
                  // console.log("4");
                  await this.createMarkersMap();
                  // console.log("5");

                  this.isLoaded = true;
                },
                (error2) => {
                  console.error(JSON.stringify(error2));
                }
              );
          })
          .catch((err) => {
            console.log("tkn err", err);
          });
      } else {
        console.log("vacío 4");
      }
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  }

  async createMarkersMap() {
    // this.showMap = false;
    const markers: Marker[] = [];
    if (this.workerOccupationsList) {
      // console.log("this.workerOccupationsList.length: "+this.workerOccupationsList.length);

      for (const worker of this.workerOccupationsList) {
        let indexOc = 0;
        if (this.selectionRequestDTO.selSubCategories) {
          // console.log("this.selectionRequestDTO.selSubCategories.length: "+this.selectionRequestDTO.selSubCategories.length);
          for (const occupation of this.selectionRequestDTO.selSubCategories) {
            if (occupation.occupationId === worker.occupationId) {
              break;
            }
            indexOc = indexOc + 1;
          }
        } else {
          console.log("vacío 2");
        }
        let stringColor = "";
        switch (this.getColorIndex(indexOc)) {
          case "primary":
            stringColor = "blue";
            break;
          case "secondary":
            stringColor = "bluesky";
            break;
          case "success":
            stringColor = "green";
            break;
          case "warning":
            stringColor = "yellow";
            break;
          case "danger":
            stringColor = "red";
            break;
          case "medium":
            stringColor = "pink";
            break;
          case "dark":
            stringColor = "black";
            break;
        }
        if (
          worker.latitudeWorker &&
          worker.longitudeWorker &&
          this.isLatitude(worker.latitudeWorker) &&
          this.isLongitude(worker.longitudeWorker)
        ) {
          let icon = {
            url: "/assets/location/pin_usuario.png", // url
            scaledSize: new google.maps.Size(50, 50), // scaled size
          };
          this.markers.push({
            position: {
              lat: worker.latitudeWorker,
              lng: worker.longitudeWorker,
            },
            options: {
              icon: icon,
            },
          });

          // console.log("adding marker");
          // const marker: Marker = this.map.addMarkerSync({
          //   title: `${worker.fullNameWorker}`,
          //   snippet: ` ${worker.nameOccupation} (Rating: ${
          //     worker.rate ? worker.rate : "0"
          //   })   ${
          //     worker.description ? worker.description : "No Detail"
          //   } - Hourly Rate: $${worker.hourlyRate}`,
          //   position: {
          //     lat: worker.latitudeWorker,
          //     lng: worker.longitudeWorker,
          //   },
          //   icon: stringColor,
          // });

          // markers.push(marker);
          // this.showMap = true;
        } else {
          console.log("vacío 3");
        }
      }
    } else {
      console.log("vacio");
    }

    this.loadingMarks = false;
  }

  getColorIndex(index: number): string {
    if (index < this.colors.length) {
      return this.colors[index];
    } else {
      return this.getColorIndex(this.colors.length - index);
    }
  }

  getWorkersBySubCat(occupationId) {
    return this.workerOccupationsMap.get(occupationId);
  }

  getWorkersBySubCatMap(occupationId) {
    return this.workerOccupationsList.filter(
      (worker) => worker.occupationId === occupationId
    );
  }

  goBack() {
    // this.reset();
    this.nav.navigateForward("home");
  }

  selectWorker(
    workerSelected: WorkerOccupationDTO,
    index: number,
    isChecked: boolean
  ) {
    // console.log('current value ' + workerSelected.selected + ' checked ' + isChecked);
    if (
      this.workersSelected.filter(
        (ws) => ws.workerId === workerSelected.workerId
      ).length > 0
    ) {
      const previousWorker: WorkerOccupationDTO = this.workersSelected.find(
        (ws) => ws.workerId === workerSelected.workerId
      );

      if (previousWorker.occupationId !== workerSelected.occupationId) {
        if (workerSelected.selected) {
          let sel: WorkerOccupationDTO[] = this.workerOccupationsMap.get(
            workerSelected.occupationId
          );
          let indextmp = 0;
          for (let tmpAct of sel) {
            if (indextmp === index) {
              const newObjectWork: WorkerOccupationDTO =
                new WorkerOccupationDTO(
                  tmpAct.workerId,
                  tmpAct.occupationId,
                  tmpAct.hourlyRate,
                  tmpAct.description,
                  tmpAct.fullNameWorker,
                  tmpAct.birthDateWorker,
                  tmpAct.genderWorker,
                  tmpAct.nationalityIdWorker,
                  tmpAct.emailWorker,
                  tmpAct.telephoneNumberWorker,
                  tmpAct.hasVehicleWorker,
                  tmpAct.profileImageWorker,
                  tmpAct.englishLevelWorker,
                  tmpAct.zipCodeWorker,
                  tmpAct.nameOccupation,
                  tmpAct.descriptionOccupation,
                  tmpAct.categoryImageOccupation,
                  tmpAct.nameNationality,
                  tmpAct.rate,
                  tmpAct.latitudeWorker,
                  tmpAct.longitudeWorker
                );
              tmpAct.descriptionOccupation = tmpAct.descriptionOccupation + "1";
              tmpAct.selected = false;
              sel[index] = newObjectWork;
            }
            indextmp = indextmp + 1;
          }
          this.workerOccupationsMap.set(workerSelected.occupationId, sel);
          this.presentAlert("Worker already selected", false);
        }
        // return;
      } else {
        this.workersSelected = this.workersSelected.filter(
          (ws) => ws.workerId !== workerSelected.workerId
        );

        // return;
      }
    } else {
      this.workersSelected.push(workerSelected);
    }
  }

  resumen() {
    if (this.workersSelected.length === 0) {
      this.presentAlert(
        "At least " + this.resources + " workers must be selected",
        false
      );
      return;
    }

    this.selectionRequestDTO.selWorkers = this.workersSelected;
    console.log(
      "Resumen de la orden: ",
      JSON.stringify(this.selectionRequestDTO)
    );
    const navigationExtras: NavigationExtras = {
      state: {
        order: this.selectionRequestDTO,
      },
    };
    // TODO
    this.router.navigate(["summary-review"], navigationExtras);
  }

  async presentAlert(messageAn: any, back: boolean) {
    const alert = await this.alertController.create({
      header: "Job Exchange",
      subHeader: "Workers List",
      message: messageAn,
      buttons: ["OK"],
    });

    await alert.present();
  }
  nuevaBusqueda() {
    this.router.navigate(["selection"]);
  }

  writeLog(logstring: string) {
    this.backendService.writeLog(logstring).subscribe((resp) => {});
  }

  validateImageL(url) {
    // console.log("Url imagen " + url);
    if (url !== null && url != "") {
      return url;
    } else {
      return "./assets/profiles ../../../../assets/profiles/profile.jpg";
    }
  }
}
