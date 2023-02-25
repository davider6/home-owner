import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { BackendService } from '../../../api/backend/backend.service';
import { SelectionRequestDTO } from '../../../model/dto/SelectionRequestDTO';
import { CategoryOccupationDTO } from '../../../model/dto/CategoryOccupationDTO';
import { WorkerOccupationDTO } from '../../../model/dto/WorkerOcuppationDTO';
import { Clients } from '../../../model/bo/Clients';
import { BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-summary-review',
  templateUrl: './summary-review.page.html',
  styleUrls: ['./summary-review.page.scss'],
})
export class SummaryReviewPage implements OnInit {

  selection: SelectionRequestDTO;
  categoriesMap = new Map();
  categoriesIds: number[] = [];
  

  firstSection: any = {
    open: false
  };

  secondSection: any = {
    open: false
  };

  thirdSection: any = {
    open: true
  };

  automaticClose: boolean = false;
  isLoaded: boolean = false;

  minDate: string;
  maxDate: string;
  selDate: string;

  constructor(private nav: NavController,
              private backendService: BackendService,
              private alertCtrl: AlertController,
              private router: Router,
              private datePipe: DatePipe) {
                if (this.router.getCurrentNavigation().extras.state) {
                  this.selection = this.router.getCurrentNavigation().extras.state.order;
                  this.selDate = this.datePipe.transform(this.selection.selDate, "d MMM yyyy H:mm");
                  let tmpDate = new Date();
                  tmpDate = new Date(tmpDate.getTime() + (1000 * 60 * 60 * 24));
                  this.minDate = this.datePipe.transform(tmpDate, "yyyy-MM-dd");
                  tmpDate = new Date(tmpDate.getTime() + (60 * (1000 * 60 * 60 * 24)));
                  this.maxDate = this.datePipe.transform(tmpDate, "yyyy-MM-dd");
                  let contCat = 0;
                  let categoriesTmp: WorkerOccupationDTO[] = [];
                  let currentAdd = false;
                  let lines = 0;
                  this.categoriesMap = new Map();
                  for (const catAct of this.selection.selWorkers) {
                    currentAdd = false;
                    categoriesTmp.push(catAct);
                    contCat++;
                    if (contCat === 2) {
                      this.categoriesIds.push(lines);
                      this.categoriesMap.set(lines, categoriesTmp);
                      categoriesTmp = [];
                      currentAdd = true;
                      contCat = 0;
                      lines++;
                    }
                  }
                  if (!currentAdd && categoriesTmp.length > 0) {
                    lines++;
                    // categoriesTmp.push(
                    //   new Categories(0, '', '', '../../../assets/img/white.png', false)
                    // );
                    this.categoriesIds.push(lines);
                    this.categoriesMap.set(lines, categoriesTmp);
                  }
                  this.isLoaded = true;
                }
              }

  ngOnInit() {
  }

  toggleSectionSection( id: number ) {
    switch (id) {
      case 1:
        this.firstSection.open = !this.firstSection.open;
        // this.secondSection.open = false;
        // this.thirdSection.open = false;
        break;
      case 2:
        // this.firstSection.open = false;
        this.secondSection.open = !this.secondSection.open;
        // this.thirdSection.open = false;
        break;
      case 3:
        // this.firstSection.open = false;
        // this.secondSection.open = false;
        this.thirdSection.open = !this.thirdSection.open;
        break;
    }
  }

  payment() {

    let rightNow = new Date();

    if ( rightNow.getTime() >= new Date(this.selDate).getTime()) {
      this.presentAlert("The project date must be future.", false);
    } else {

      this.selection.selDate = new Date(this.selDate);
      const navigationExtras: NavigationExtras = {
        state: {
          order: this.selection,
        },
      };

      this.router.navigate(["payments"], navigationExtras);
    }
  }

  hasWorkerSelected(occupationId) {
    const worker = this.selection.selWorkers.find(
      (w) => w.occupationId === occupationId
    );

    if (worker) {
      return "checkmark";
    } else {
      return "";
    }
  }

  async selectNewCategories(){
    const alert = await this.alertCtrl.create({
      header: "Job Exchange",
      subHeader: "Search Engine",
      message: 'Are you sure you want to change the subcategory as you will lose your data?',
      buttons: [ {
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        },
      },
      {
        text: 'Yes',
        handler: () => {
          this.router.navigate(["/selection"])
        },
      },]
    });

    await alert.present();
 
  }

  reselectWorkers(){
    this.router.navigate(["/list-workers-map"])
  }

  async presentAlert(messageAn: any, back: boolean) {
    const alert = await this.alertCtrl.create({
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

  validateImageL(url) {
    //console.log('Url imagen ' + url)
    if (url !== null && url != '') {
      return url;
    } else {
      return '../../../../assets/profiles/profile.jpg';
    }
  }

}
