import { SharedModule } from "src/app/components/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { OrderHistoryPage } from "./order-history.page";

const routes: Routes = [
  {
    path: "",
    component: OrderHistoryPage,
    children: [
      {
        path: "inProgress",
        loadChildren: () =>
          import("./in-progress/in-progress.module").then(
            (m) => m.InProgressPageModule
          ),
      },
      {
        path: "history",
        loadChildren: () =>
          import("./history/history.module").then((m) => m.HistoryPageModule),
      },
    ],
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
  declarations: [OrderHistoryPage],
})
export class OrderHistoryPageModule {}
