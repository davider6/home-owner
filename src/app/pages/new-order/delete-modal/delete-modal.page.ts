import { Component, OnInit } from "@angular/core";
import { File, FileEntry } from "@capacitor/file/ngx";
import { ModalController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { WebView } from "@capacitor/ionic-webview/ngx";

@Component({
  selector: "app-delete-modal",
  templateUrl: "./delete-modal.page.html",
  styleUrls: ["./delete-modal.page.scss"],
})
export class DeleteModalPage implements OnInit {
  files = [];
  MEDIA_FOLDER_NAME = "";
  constructor(
    private file: File,
    private modalController: ModalController,
    private storage: Storage,
    private webView: WebView
  ) {}

  ngOnInit() {
    this.storage.get("Current_Folder").then((name) => {
      console.log("Este es el path: ", name);
      this.MEDIA_FOLDER_NAME = name;
      this.loadFiles();
    });
  }

  loadFiles() {
    // this.files = [];
    // this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(
    //   res => {
    //     this.files = res;
    //   },
    //   err => console.log("error loading files: ", err)
    // );
    this.storage.get(this.MEDIA_FOLDER_NAME).then((images) => {
      console.log("Lo que tiene en memo: ", JSON.stringify(images));
      if (images) {
        const arr = JSON.parse(images);
        this.files = [];
        for (const img of arr) {
          const filePath =
            this.file.externalCacheDirectory + this.MEDIA_FOLDER_NAME + "/" + img;
          const resPath = this.pathForImage(filePath);
          this.files.push({ name: img, path: resPath, filePath });
        }
      }
    });
  }
  pathForImage(img) {
    if (img === null) {
      return "";
    } else {
      const converted = this.webView.convertFileSrc(img);
      return converted;
    }
  }

  deleteFile(imgEntry, position: number) {
    this.files.splice(position, 1);
    this.storage.get(this.MEDIA_FOLDER_NAME).then((images) => {
      const arr = JSON.parse(images);
      const filtered = arr.filter((name) => name != imgEntry.name);
      this.storage.set(this.MEDIA_FOLDER_NAME, JSON.stringify(filtered));

      const correctPath = imgEntry.filePath.substr(
        0,
        imgEntry.filePath.lastIndexOf("/") + 1
      );

      this.file.removeFile(correctPath, imgEntry.name).then((res) => {
        console.log("Imagen Eliminada");
      });
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
