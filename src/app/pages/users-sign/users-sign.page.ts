import { Component, OnInit } from '@angular/core';
import { AuthwebService } from "../../services/authweb.service";
import { ActivatedRoute } from "@angular/router";
import { BackendService } from "../../api/backend/backend.service";
import { Storage } from "@ionic/storage";
import { Router } from "@angular/router";

@Component({
  selector: 'app-users-sign',
  templateUrl: './users-sign.page.html',
  styleUrls: ['./users-sign.page.scss'],
})
export class UsersSignPage implements OnInit {
  signType: string;

  constructor(
      private authWeb: AuthwebService,
      private route: ActivatedRoute,
      private backend: BackendService,
      private storage: Storage,
      private router: Router
  ) {
    this.signType = this.route.snapshot.params.type;
    // Login de usuario Existente
    if(this.signType === 'webIn'){
      this.webIn();
    }

    // Creación de nuevo usuario
    if(this.signType === 'webUp'){
      this.webUp();
    }

    // LogOut de usuario
    if(this.signType === 'webOut'){
      this.storage.remove('userOAuth').then();
      this.storage.remove('user').then();
      this.storage.remove('token').then();
      this.authWeb.logout();
    }
  }

  ngOnInit() {

  }

  async webIn(){
    const OAuthUser = await this.OAuthUser();
    if( !OAuthUser ) {
      return;
    }

    const tokenProvider = this.OAuthProvider(OAuthUser.sub);
    const tokenKey = this.OAuthKey(OAuthUser.sub);

    const userExists = await this.userExists(tokenKey, tokenProvider);

    if (!userExists){
      console.log('existe');
      await this.storage.remove('userOAuth');
      await this.router.navigate(['/home-owner']);
      return;
    }

    const token: any = await this.backend.getAuthToken({username: tokenKey, type: tokenProvider}).toPromise();

    this.storage.set('token', token).then();
    this.backend.getUserById(token.token, token.clientId).subscribe(
        user => {
          this.storage.set('user', user);
          this.storage.remove('userOAuth')
        }
    );
  }

  async webUp(){
    const OAuthUser = await this.OAuthUser();
    if( !OAuthUser ) {
      return;
    }

    const tokenProvider = this.OAuthProvider(OAuthUser.sub);
    const tokenKey = this.OAuthKey(OAuthUser.sub);

    const userExists = await this.userExists(tokenKey, tokenProvider);


    if (userExists){
      this.router.navigate(['/login', 'search']);
    } else {
      await this.createUserFromOauth(OAuthUser, tokenKey, tokenProvider);

      const user = await this.getStorageUser();

      console.log(user);

      this.backend.getAuthToken( user ).subscribe(
          resp => {
            this.storage.set('token', resp);
          }
      );
    }
    this.router.navigate(['/home']);

  }

  async OAuthUser(){
    let user = null;
    await this.authWeb.userProfile$.subscribe(
        autUser => {
          if ( autUser ){
            user = autUser;
            this.storage.set('userOAuth', autUser);
            console.log('no null');
          }
        }
    );

    if( !user ){
      await this.storage.get('userOAuth').then( dbUser => {
        user = dbUser;
      });
    }

    return user;
  }

  OAuthProvider( token ){
    const tokenProvider = token.substr(0, token.indexOf(String.fromCharCode(124)));

    if(tokenProvider === 'facebook'){
      return 'F';
    }else if (tokenProvider === 'google-oauth2') {
      return 'G'
    }else {
      return 'N'
    }
  }

  OAuthKey( token ){
    return token.substr(token.indexOf(String.fromCharCode(124)) + 1);
  }

  async userExists(tokenKey, tokenProvider){
    const exists: any = await this.backend.userExists(tokenKey, tokenProvider).toPromise();
    return exists.exists;
  }

  async createUserFromOauth(OAuthUser, tokenKey, tokenProvider) {
    const user = await this.backend.postExternalUser(OAuthUser, tokenKey, tokenProvider).toPromise();

    if(user){
      await this.storage.set('user', user);
    }


    // await this.backend.postExternalUser(OAuthUser, tokenKey, tokenProvider).subscribe(
    //     data => {
    //       this.storage.set('user', data);
    //     },
    //     error => {
    //       console.log('No se pudo crear el usuario')
    //     }
    // );
  }

  async getStorageUser(){
    let user = null;
    await this.storage.get('user').then(
        storageUser => {
          user = {
            username: storageUser.externalId,
            type: storageUser.type
          };
        }
    );
    return user;
  }


}
