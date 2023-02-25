import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { WorkersService } from 'src/app/api/workers/workers.service';
import { OccupationsService } from 'src/app/api/occupations/occupations.service';
import { WorkersOccupationService } from '../../api/workersOccupation/workers-occupation.service';
import { BackendService } from 'src/app/api/backend/backend.service';
import { RequestFields } from 'src/app/model/bo/RequestFields';

@Component({
  selector: 'app-registry',
  templateUrl: './registry.page.html',
  styleUrls: ['./registry.page.scss'],
})
export class RegistryPage implements OnInit {

  categories:any = [];
  occupations:any = [];
  english:string = null;
  stat:boolean = false;
  imgProfile:string = "../../../assets/profiles/profile5.png";
  nationality:number = 1;

  constructor(private nav: NavController,
              private ws: WorkersService,
              private os: OccupationsService,
              private woo: WorkersOccupationService,
              private bks: BackendService,
              private http: HttpClient,
              private alertController: AlertController) {

                this.loadCategories();
  }

  ngOnInit() {
  }

  loadOccupations(categories:string[]){

    this.occupations = [];

    categories.forEach((category) => {

      let reqField: RequestFields[] = [ {fieldName: 'categoryId', fieldValue: category} ];

      this.bks.getItemsByMethodCache("categoryOccupationsByCategoryId", reqField, sessionStorage.getItem('token') ).subscribe( (data) => {
        
        if (this.occupations.length > 0)
          this.occupations = this.occupations.concat(data);
        else
          this.occupations = data;

      });
    });
  }

  loadCategories(){
    this.bks.getItemsByMethodCache('categories', null, sessionStorage.getItem('token') ).subscribe( (data) => {
      this.categories = data;
    });
  }

  register(form:any){

    //console.log(form.value);
    //console.log(form.value.status);

    if ( form.value.categoriesId == '' ){
      this.presentAlert('No ha seleccionado ninguna categoría.', false);    
    }else if ( form.value.occupationsId == '' ){
      this.presentAlert('No ha seleccionado ninguna sub-categoría.', false);    
    }else if ( form.value.fullName == '' ){
      this.presentAlert('No ha ingresado su nombre.', false);
    }else if ( form.value.telephoneNumber == '' ){
      this.presentAlert('No ha ingresado el número de teléfono.', false);
    }else if ( form.value.email == '' ){
      this.presentAlert('No ha ingresado un email valido.', false);
    }else if ( this.english === null || this.english === '' ){
      this.presentAlert('No ha seleccionado el nivel de inglés.', false);
    }else if ( form.value.workerPassword === null || form.value.workerPassword === '' ){
      this.presentAlert('No ha ingresado una contraseña.', false);
    }else if ( form.value.workerPassword2 === null || form.value.workerPassword2 === '' ){
      this.presentAlert('No ha confirmado la contraseña.', false);
    }else if ( form.value.workerPassword !== form.value.workerPassword2 ){
      this.presentAlert('La contraseña ingresada no coincide.', false);
    }else{
      let url:string = `${ this.ws.URL_SERVICE }`;

      console.log(form.value);

      this.http.post(url,form.value).subscribe((data) => {

        //console.log('data',data);

        if (data['id']>0){
          let woo:number[] = form.value.occupationsId;

          woo.forEach((idOccupation) => {
            let workerOccupation:any = {
              "id" : {
                "occupationId": idOccupation,
                "workerId": data['id']
              },
              "occupationId": idOccupation,
              "workerId": data['id'],
              "rate": 0,
              "hourlyRate": 1,
              "reviews": 0,
              "status": true
            }; 

            this.http.post(this.woo.URL_SERVICE, workerOccupation).subscribe((data) => {});
          });
        }
        
        this.presentAlert('Su registro ha sido recibido exitosamente, pronto nos pondremos en contacto contigo.', true);

      }, ( error: HttpErrorResponse ) => {

          //console.log('error',error.error);

          //console.log(error.error['message']);

          if ( error.error['message'].includes('WORKERS_UN') ){
            this.presentAlert('El email ingresado ya se encuentra registrado.', false);
          } else {
            this.presentAlert('Ocurrió un error durante el registro del usuario.', false);
          }
          
      });
    }
  }

  selectingCategories(form:any){
    this.loadOccupations(form.value.categoriesId);
  }

  async presentAlert( message: any , back: boolean) {
    const alert = await this.alertController.create({
      header: 'Registro Nuevo',
      subHeader: 'Job Exchange',
      message: message,
      buttons: ['OK']
    });

    await alert.present();

    if (back)
      this.nav.navigateForward('/home');
  }

  goBack(){
    this.nav.navigateForward(['/home']);
  }

}
