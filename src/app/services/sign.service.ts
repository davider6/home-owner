import { Injectable } from "@angular/core";
import { BackendService } from "../api/backend/backend.service";
import { Storage } from "@ionic/storage";
import { AuthwebService } from "./authweb.service";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class SignService {
  constructor(
    private backend: BackendService,
    private storage: Storage,
    private authWeb: AuthwebService,
    private authMobile: AuthService,
    private router: Router
  ) { }

  async getToken(email, password, type, OAuthKey, entity = "C", deviceId): Promise<any> {
    let user = null;
    if (password) {
      user = { password, type, username: email, entity, deviceId };
    } else {
      user = { type, username: OAuthKey };
    }
    Object.assign(user, {entity: "C"});
    return await this.backend.getAuthToken( user ).toPromise();
  }

  async logout( type? : string ){
    await this.storage.clear();
    if (this.authWeb.loggedIn) {
      this.authWeb.logout();
    }

    if ( type === 'user-exists') {
      await this.router.navigate(['/sign/home/user-exists']);
    } else if ( type === 'user-not-exists') {
      await this.router.navigate(['/sign/home/user-exists']);
    }
    await this.router.navigate(['/']);
  }

  async isNotAuthenticated(): Promise<boolean> {
    if (await this.storage.get("token")) {
      return false;
    }
    if (await this.storage.get("user")) {
      return false;
    }
    return true;
  }

  async isAuthenticated(): Promise<boolean> {
    if (!(await this.storage.get("token"))) {
      return false;
    }

    if (!(await this.storage.get("user"))) {
      return false;
    }

    return true;
  }

  // Web Auth0
  async saveWebTokenOAuth() {
    let user = null;
    if (this.authWeb.loggedIn) {
      await this.authWeb.userProfile$.subscribe(
        autUser => {
          if ( autUser ){
            user = autUser;
            this.storage.set('userOAuth', autUser);
          }
        }
      );
    }

    if (!user) {
      await this.storage.get("userOAuth").then((dbUser) => {
        user = dbUser;
      });
    }
    return user;
  }

  async userExistsTokenOAuth(OAuthKey, OAuthProvider) {
    const exists: any = await this.backend
      .userExists(OAuthKey, OAuthProvider)
      .toPromise();
    return exists.exists;
  }

  OAuthProvider(token) {
    const tokenProvider = token.substr(
      0,
      token.indexOf(String.fromCharCode(124))
    );

    if (tokenProvider === "facebook") {
      return "F";
    } else if (tokenProvider === "google-oauth2") {
      return "G";
    } else {
      return "N";
    }
  }

  OAuthKey(token) {
    return token.substr(token.indexOf(String.fromCharCode(124)) + 1);
  }
}
