import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { SelectionPage } from "./selection.page";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SharedModule } from "src/app/components/shared.module";

const routes: Routes = [
  {
    path: "",
    component: SelectionPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
  ],
  declarations: [SelectionPage],
})
export class SelectionPageModule {}
