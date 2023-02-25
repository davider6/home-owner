import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";
import { SharedModule } from "src/app/components/shared.module";
import { SummaryReviewPage } from "./summary-review.page";

const routes: Routes = [
  {
    path: "",
    component: SummaryReviewPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [SummaryReviewPage],
})
export class SummaryReviewPageModule {}
