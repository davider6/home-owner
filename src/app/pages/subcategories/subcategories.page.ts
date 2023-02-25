import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestFields } from '../../model/bo/RequestFields';
import { BackendService } from '../../api/backend/backend.service';
import { CategoryOccupationDTO } from 'src/app/model/dto/CategoryOccupationDTO';
import { Categories } from 'src/app/model/bo/Categories';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-subcategories',
  templateUrl: './subcategories.page.html',
  styleUrls: ['./subcategories.page.scss'],
})
export class SubcategoriesPage implements OnInit {

  categoryId = null;
  catOccList: CategoryOccupationDTO[] = null;
  selCategory: Categories;
  isReady = false;
  constructor(private actRoute: ActivatedRoute, private backendService: BackendService,
              private nav: NavController) {
      //console.log('Cargando subcategorias');
      this.categoryId = this.actRoute.snapshot.paramMap.get('categoryId');
      this.backendService.getEntityDetailById('categories', this.categoryId, sessionStorage.getItem('token')).subscribe(resp => {
        this.selCategory = (resp as Categories);
        //console.log('Categoria padre cargada ', this.selCategory.id);
        const reqField: RequestFields[] = [ {fieldName: 'categoryId', fieldValue: this.categoryId + ''} ];
        this.backendService.getItemsByMethodCache('categoryOccupationsByCategoryId', reqField, sessionStorage.getItem('token')).
        subscribe(respList => {
          //console.log('SubCategorias  cargadas');
          this.catOccList = (respList as CategoryOccupationDTO[]);
          this.isReady = true;
        }, error2 => {
          console.log('Error subcategorias');
          console.error(JSON.stringify(error2));
        });
      }, error2 => {
        console.error(JSON.stringify(error2));
      });
    }

    goList(occupationId) {
      this.nav.navigateForward(`/list/${ occupationId }`);
    }

  ngOnInit() {
  }

}
