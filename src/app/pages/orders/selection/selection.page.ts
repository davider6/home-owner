import { Component, OnInit, ViewChild } from "@angular/core";
import {
  NavController,
  ToastController,
  AlertController,
  ModalController,
  IonSlides,
  MenuController,
} from "@ionic/angular";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { BackendService } from "../../../api/backend/backend.service";
import { CategoryOccupationDTO } from "../../../model/dto/CategoryOccupationDTO";
import { RequestFields } from "../../../model/bo/RequestFields";
import { Categories } from "src/app/model/bo/Categories";
import { SelectionRequestDTO } from "../../../model/dto/SelectionRequestDTO";
import { ImageSliderComponent } from "../../../components/image-slider/image-slider.component";
import { Storage } from "@ionic/storage";
import { Token } from "src/app/model/bo/Token";
import { Clients } from "src/app/model/bo/Clients";
import { DatePipe } from "@angular/common";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  providers: [ImageSliderComponent],
  selector: "app-selection",
  templateUrl: "./selection.page.html",
  styleUrls: ["./selection.page.scss"],
})
export class SelectionPage implements OnInit {
  openCategory: boolean;
  openOccupation: boolean;
  openOrder: boolean;
  categoriesMap = [];
  categoriesIds: number[] = [];
  selCategory: Categories;
  selSubCategories: CategoryOccupationDTO[] = [];
  categoryOccupations: CategoryOccupationDTO[] = [];
  selCategoryOccupations: CategoryOccupationDTO[] = [];
  selDate: string;
  selResources = 1;
  selAddress: string;
  selDuration = 8;
  selZipCode: string;
  selVehicle: boolean;
  selDescription: string;
  token: Token;
  client: Clients;
  minDate: string;
  maxDate: string;
  isLoaded = false;

  address: string;
  zipCode: string;
  latitude: number;
  longitude: number;

  columnsSub: any[] = [
    { prop: "occName", name: "Subcategory" },
    { prop: "occDescription", name: "Description" },
  ];

  hoursSelection: any[] = [4, 8];

  @ViewChild("slides", { static: true }) slider: IonSlides;

  constructor(
    private nav: NavController,
    public toastCtrl: ToastController,
    private alertController: AlertController,
    private backendService: BackendService,
    public modalController: ModalController,
    private router: Router,
    private storage: Storage,
    private imageSlider: ImageSliderComponent,
    private datePipe: DatePipe,
    private route: ActivatedRoute
  ) {
    this.reset();

    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.address = this.router.getCurrentNavigation().extras.state.address;
        this.zipCode = this.router.getCurrentNavigation().extras.state.zipCode;
        this.latitude =
          this.router.getCurrentNavigation().extras.state.latitude;
        this.longitude =
          this.router.getCurrentNavigation().extras.state.longitude;
      }
    });

    this.loadCategories();
  }

  ngOnInit() {}

  goBack() {
    this.reset();
    this.nav.navigateForward("home");
  }

  openCategoryAct() {
    this.openCategory = !this.openCategory;
    // if (this.openCategory) {
    //   this.openOccupation = false;
    //   this.openOrder = false;
    // }
  }

  onSelectCategory(selected) {
    if (!selected || !selected.status) {
      return;
    }
    this.selCategory = selected;
    this.selSubCategories = [];
    this.loadOccupations(selected);
  }

  openOccupationAct() {
    this.openOccupation = !this.openOccupation;
    // if (this.openOccupation) {
    //   this.openCategory = false;
    //   this.openOrder = false;
    // }
  }

  onSelectSub(event, occupation) {
    setTimeout(() => {
      let occp = { ...occupation };
      delete occp.isChecked;

      if (event.target.checked) {
        this.selSubCategories.push(occp);
      } else {
        this.selSubCategories = this.selSubCategories.filter((sub) => {
          if (sub.occupationId != occp.occupationId) {
            return sub;
          }
        });
      }
    }, 100);
  }

  openOrderAct() {
    this.openOrder = !this.openOrder;
    // if (this.openOrder) {
    //   this.openCategory = false;
    //   this.openOccupation = false;
    // }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: SelectionPage,
      componentProps: { value: 123 },
    });
    return await modal.present();
  }

  async loadCategories() {
    this.client = await this.storage.get("user");

    if (this.address) {
      this.client.address = this.address;
      this.client.zipCode = this.zipCode;
      this.client.latitude = this.latitude;
      this.client.longitude = this.longitude;

      this.storage.set("user", this.client);
    }

    this.selAddress = this.client.address;
    this.selZipCode = this.client.zipCode;
    this.token = await this.storage.get("token");

    this.backendService
      .getItemsByMethodCache("categories", null, this.token.token)
      .subscribe(
        (resp: Categories[]) => {
          this.categoriesMap = resp;
          this.isLoaded = true;
        },
        (error2) => {
          console.error(JSON.stringify(error2));
        }
      );
  }

  loadOccupations(category: Categories) {
    this.categoryOccupations = [];
    const reqField: RequestFields[] = [
      { fieldName: "categoryId", fieldValue: category.id + "" },
    ];

    this.backendService
      .getItemsByMethodCache(
        "categoryOccupationsByCategoryId",
        reqField,
        this.token.token
      )
      .subscribe((data: CategoryOccupationDTO[]) => {
        this.categoryOccupations = data;
        this.openCategory = false;
        this.openOccupation = true;
      });
  }

  async presentAlert(messageAn: any, back: boolean) {
    const alert = await this.alertController.create({
      header: "Job Exchange",
      subHeader: "Search Engine",
      message: messageAn,
      buttons: ["OK"],
    });

    await alert.present();

    if (back) {
      this.nav.navigateForward("/results");
    }
  }

  next() {
    let rightNow = new Date();

    if (!this.selResources) {
      this.presentAlert("Resources is required", false);
    } else if (!this.selDate) {
      this.presentAlert("Proposed date is required.", false);
    } else if (this.selAddress === "") {
      this.presentAlert("Address is required.", false);
    } else if (this.selZipCode === "") {
      this.presentAlert("Zip Code is required.", false);
    } else if (!this.selDuration) {
      this.presentAlert("Duration is required.", false);
    } else if (!this.selCategory) {
      this.presentAlert("Category is required.", false);
    } else if (!this.selSubCategories || this.selSubCategories.length < 1) {
      this.presentAlert("Select at least one subcategory.", false);
    } else {
      let projectDate = new Date(this.selDate.toString());

      if (rightNow.getTime() >= projectDate.getTime()) {
        this.presentAlert("The project date must be future.", false);
      } else {
        const selValues: SelectionRequestDTO = new SelectionRequestDTO(
          new Date(this.selDate),
          this.selResources,
          this.selAddress,
          this.selDuration,
          this.selZipCode,
          this.selVehicle,
          this.selDescription,
          this.selSubCategories,
          []
        );
        //console.log("Selected Values ", selValues);

        const navigationExtras: NavigationExtras = {
          state: {
            order: selValues,
            latitude: this.latitude,
            longitude: this.longitude,
          },
        };
        this.reset();
        this.router.navigate(["list-workers-map"], navigationExtras);
      }
    }
  }

  async reset() {
    this.openCategory = true;
    this.openOccupation = false;
    this.openOrder = false;
    this.selSubCategories = [];
    this.categoryOccupations = [];
    this.selCategory = null;
    let tmpDate = new Date();
    this.selDate = null;
    tmpDate = new Date(tmpDate.getTime() + 1000 * 60 * 60 * 24);
    this.selDate = this.datePipe.transform(tmpDate, "d MMM yyyy H:mm");
    this.minDate = this.datePipe.transform(tmpDate, "yyyy-MM-dd");
    tmpDate = new Date(tmpDate.getTime() + 60 * (1000 * 60 * 60 * 24));
    this.maxDate = this.datePipe.transform(tmpDate, "yyyy-MM-dd");
    this.selResources = 1;
    this.selDuration = 8;
    this.selVehicle = false;
    this.selDescription = null;
  }

  goHome() {
    this.router.navigate(["/home"]);
  }
}
