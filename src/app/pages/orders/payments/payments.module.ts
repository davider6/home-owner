import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PaymentsPage } from './payments.page';
import { SharedModule } from "src/app/components/shared.module";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

const routes: Routes = [
  {
    path: '',
    component: PaymentsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes),
    NgxDatatableModule
  ],
  declarations: [PaymentsPage]
})
export class PaymentsPageModule {}
