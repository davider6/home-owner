import { Component, OnInit } from '@angular/core';
import { OccupationsService } from 'src/app/api/occupations/occupations.service';
import { NavController } from '@ionic/angular';
import { Categories } from 'src/app/model/bo/Categories';
import { BackendService } from '../../api/backend/backend.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  categoriesList: Categories[] = [];

  ngOnInit() {
  }

  constructor(public api: OccupationsService,
              private nav: NavController, private backendService: BackendService) { 
              this.loadOccupations();
  }

  doRefresh(event:any) {
    setTimeout(() => {
      this.loadOccupations();
      event.target.complete();
    }, 1500);
  }

  loadOccupations() {
    this.backendService.getItemsByMethodCache( 'categories', null, sessionStorage.getItem('token') ).subscribe(resp => {
      this.categoriesList = (resp as Categories[]);
    }, error2 => {
        console.error(JSON.stringify(error2));
    });
  }

  goList(categoryId) {
    console.log(`Navegando a subcategorias /subcategories/${ categoryId } `)
    this.nav.navigateForward(`/subcategories/${ categoryId }`);
  }

  goRegistry() {
    this.nav.navigateForward('/registry');
  }

}
