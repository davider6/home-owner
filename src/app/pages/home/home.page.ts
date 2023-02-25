import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { MenuController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { BackendService } from "src/app/api/backend/backend.service";
import { Clients } from "src/app/model/bo/Clients";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  client: Clients;

  constructor(
    private router: Router,
    private storage: Storage,
    private backendService: BackendService,
    private menu: MenuController,
    private afAuth: AngularFireAuth
  ) {}

  async ngOnInit() {
    this.client = await this.storage.get("user");
    console.log("home", this.client);
  }

  startOrder() {
    //this.router.navigate(['/selection']);
    this.router.navigate(["/address-selector/exists"]);
  }

  ordersByClient() {
    //this.router.navigate(['/selection']);
    console.log("before my orders /order-history/" + this.client.id);
    this.router.navigate(["/order-history/" + this.client.id]);
  }

  signOut() {
    this.menu.enable(false, "end");
    this.menu.close("end");
    this.afAuth.auth
      .signOut()
      .then((resp) => {
        console.log("succefully signout", resp);
        this.backendService.cleanStorage();
        this.storage.remove("user");
        this.storage.clear();
        this.storage.set("welcomepage", true);
        this.closeMenu();
        this.router.navigate(["/login"]);
      })
      .catch((err) => {
        console.log("error signing out", err);
      });
  }

  openInfoProfile() {
    this.menu.enable(true, "end");
    this.menu.open("end");
  }

  closeMenu() {
    this.menu.close("main-menu");
  }
}
