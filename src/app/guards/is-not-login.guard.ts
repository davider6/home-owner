import { Injectable } from '@angular/core';
import { CanActivateChild } from '@angular/router';
import { Router } from "@angular/router";
import {SignService} from "../services/sign.service";

@Injectable({
  providedIn: 'root'
})
export class IsNotLoginGuard implements CanActivateChild {
  constructor(
    private router: Router,
    private sign: SignService
  ) {
  }

  async canActivateChild(): Promise<boolean> {
    if(await this.sign.isNotAuthenticated()){
      return true
    } else {
      this.router.navigate(['/home'])
      return false
    }
  }
}
