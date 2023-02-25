import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public user: Observable<any>;
  private userData = new BehaviorSubject(null);

  constructor(
    private router: Router,
    private ionicStorage: Storage
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('Guard');
      this.ionicStorage.get('token').then((result) => {
        console.log('Token exists');
        if (result) {
          if (!helper.isTokenExpired(result.token)) {
            resolve(true);
          } else {
            this.ionicStorage.clear();
            console.log('Expired token');
            this.router.navigate(['/login']);
            resolve(true);
          }
        }  else {
          this.ionicStorage.clear();
          console.log('User is not logged in');
          this.router.navigate(['/login']);
          resolve(true);
          // this.ionicStorage.get('home').then((result2) => {
          //   if (result2) {
          //     this.ionicStorage.clear();
          //     console.log('User is not logged in');
          //     this.router.navigate(['/login']);
          //     resolve(false);
          //   } else {
          //     console.log('User logged in');
          //     this.router.navigate(['/login']);
          //     resolve(false);
          //   }
          // });
        }
      });
    });
  }
}
