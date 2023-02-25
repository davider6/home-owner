import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopemailComponent } from '../../components/popemail/popemail.component';

@NgModule({
  entryComponents: [
    PopemailComponent
  ]
})
export class LoginPageRoutingModule {}
