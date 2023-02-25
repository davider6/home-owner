import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { File, FileEntry } from "@capacitor/file/ngx";
import { Camera, CameraOptions } from "@capacitor/camera/ngx";
import { PhotoViewer } from "@capacitor/photo-viewer/ngx";
import { Platform, ActionSheetController } from "@ionic/angular";
import { HttpResponse, HttpEventType } from "@angular/common/http";
import {
  MediaCapture,
  MediaFile,
  CaptureError,
} from "@capacitor/media-capture/ngx";
import { Storage } from "@ionic/storage";
import { WebView } from "@capacitor/ionic-webview/ngx";
import { ManageFilesServiceService } from "../../services/manage-files-service.service";
import { DeleteModalPage } from "../../pages/new-order/delete-modal/delete-modal.page";
import { Token } from "src/app/model/bo/Token";
import { ImageResizer, ImageResizerOptions } from '@capacitor/image-resizer/ngx';

declare var window: any;

const MEDIA_FOLDER_NAME = "new_orders";
const MEDIA_CLOSED_FOLDER_NAME = "closed_orders";
const MEDIA_TEMP_FOLDER_NAME = "temp_orders";
@Component({
  selector: "app-image-slider",
  templateUrl: "./image-slider.component.html",
  styleUrls: ["./image-slider.component.scss"],
})
export class ImageSliderComponent implements OnInit {
  @Input() upload: boolean;
  @Input() orderId: string;
  @Input() closed: boolean;
  @Input() temp: boolean;
  @Input() loadTemp: boolean;

  images = [];
  progress: { percentage: number } = { percentage: 0 };
  loading = true;
  isClose: string;
  isTemp: string;
  sliderOpts = {
    zoom: false,
    slidesPerview: 1.5,
    centeredSlides: true,
    spaceBetween: 20,
    preloadImages: true,
  };
  token: Token;
  imagePreview: any;

  constructor(
    private plt: Platform,
    private file: File,
    private imageFile: File,
    private camera: Camera,
    private photoViewer: PhotoViewer,
    private webView: WebView,
    private storage: Storage,
    private uploadService: ManageFilesServiceService,
    private mediaCapture: MediaCapture,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private ref: ChangeDetectorRef,
    private imageResizer: ImageResizer
  ) {}

  async ngOnInit() {
    this.loading = false;
    this.isClose = String(this.closed);
    this.isTemp = String(this.temp);
    this.plt.ready().then(async () => {
      this.storage.get("token").then((tk) => {
        this.token = tk;
      });
      if (!this.loadTemp) {
        await this.prepareFolder();
      } else {
        await this.loadImages();
      }
    });
  }

  selectFolder() {
    if (this.temp) {
      console.log('selectFolder()',MEDIA_TEMP_FOLDER_NAME);
      return MEDIA_TEMP_FOLDER_NAME;
    } else if (this.closed) {
      console.log('selectFolder()',MEDIA_CLOSED_FOLDER_NAME);
      return MEDIA_CLOSED_FOLDER_NAME;
    } else {
      console.log('selectFolder()',MEDIA_FOLDER_NAME);
      return MEDIA_FOLDER_NAME;
    }
  }

  async prepareFolder() {
    this.storage.set(this.selectFolder(), null);
    const path = this.file.externalCacheDirectory;

    this.file
      .checkDir(path, this.selectFolder())
      .then(
        () => {
          this.file.removeRecursively(path, this.selectFolder()).then(() => {
            this.file
              .createDir(path, this.selectFolder(), false)
              .then(async () => {
                if (!this.upload) {
                  setTimeout(async () => {
                    const filesFromOrder = await this.uploadService
                      .listFiles(
                        this.orderId,
                        this.isClose,
                        this.isTemp,
                        this.token.token
                      )
                      .then(async (result) => {
                        await this.downloadImages(result);
                      });
                  }, 1000);
                } else {
                  this.loading = false;
                }
              });
          });
        },
        (err) => {
          this.file.createDir(path, this.selectFolder(), false);
        }
      )
      .finally(() => {
        this.loading = false;
      });
  }

  async downloadImages(listOfImages) {
    const listOfDowloadedImages = [];
    for (var i = 0; i < listOfImages.length; i++) {
      await this.uploadService
        .downloadResource(
          listOfImages[i],
          this.orderId,
          this.isClose,
          this.isTemp,
          this.token.token
        )
        .then((blobResult) => {
          const newObject = {
            fileName: listOfImages[i],
            blob: blobResult,
          };
          listOfDowloadedImages.push(newObject);
        });
    }
    await this.createFile(listOfDowloadedImages);
  }

  async createFile(listOfImages) {
    for (var i = 0; i < listOfImages.length; i++) {
      const imageProccessed = await this.copyFileToLocalDir(
        null,
        listOfImages[i].blob,
        listOfImages[i].fileName
      );
    }

    this.ref.detectChanges();
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  async loadImages() {
    return new Promise<string>((resolve) => {
      this.storage.get(this.selectFolder()).then((images) => {
        if (images) {
          const arr = JSON.parse(images);
          this.images = [];
          for (const img of arr) {
            const filePath =
              this.file.externalCacheDirectory + this.selectFolder() + "/" + img;
              console.log('filePath',filePath);
            const resPath = this.pathForImage(filePath);
            this.images.push({ name: img, path: resPath, filePath });
          }
          this.loading = false;
          resolve("Images loaded");
        }
      });
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

  async updateStoredImages(newName) {
    return new Promise<string>((resolve) => {
      this.storage.get(this.selectFolder()).then((images) => {
        const arr = JSON.parse(images);
        if (!arr) {
          const newImages = [newName];
          this.storage.set(this.selectFolder(), JSON.stringify(newImages));
        } else {
          arr.push(newName);
          this.storage.set(this.selectFolder(), JSON.stringify(arr));
        }

        const filePath =
          this.file.externalCacheDirectory + this.selectFolder() + "/" + newName;
        const resPath = this.pathForImage(filePath);

        const newEntry = {
          name: newName,
          path: resPath,
          filePath,
        };
        console.log('newEntry',newEntry);
        console.log('1');
        setTimeout(() => {
          console.log('2');
          this.images = [newEntry, ...this.images];
        }, 250);
        resolve(newName + " image stored");
      });
    });
  }

  async selectMedia() {
    const actionSheet = await this.actionSheetController.create({
      header: "What would you like to add?",
      buttons: [
        {
          text: "Capture Image",
          handler: () => {
            this.captureImage();
          },
        },

        {
          text: "Load images from gallery",
          handler: () => {
            this.pickImages();
          },
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });
    await actionSheet.present();
  }

  async copyFilesSeleted(base64Data, selectedImages) {

    await this.plt.ready().then(() =>{
			if(this.plt.is('android')) {
				this.file.checkDir(this.file.externalCacheDirectory, this.selectFolder()).then(response => {
					console.log('Directory exists:'+response);
				}).catch(err => {
					console.log('Directory doesn\'t exist:'+JSON.stringify(err));
					this.file.createDir(this.file.externalCacheDirectory, this.selectFolder(), false).then(response => {
						console.log('Directory create:'+response);
					}).catch(err => {
						console.log('Directory no create:'+JSON.stringify(err));
					}); 
				});
			}
    });
    
    const ext = selectedImages.split(".").pop();
    const d = Date.now();
    let newName = `${d}.${ext}`;

    if (newName.indexOf("?") >=0){
      newName = newName.substr(0, newName.lastIndexOf("?"));
    }

    let name: string = selectedImages.substr(selectedImages.lastIndexOf("/") + 1);

    if (name.indexOf("?") >=0){
      name = name.substr(0, name.lastIndexOf("?"));
    }

    console.log('name',name);
    let copyFrom: string = selectedImages.substr(0, selectedImages.lastIndexOf("/") + 1);
    console.log('copyFrom before: ', copyFrom);

    let origin = copyFrom.replace("http://localhost/_app_file_/", "file:///");
    console.log('copyFrom after: ', origin);

    const copyTo = this.file.externalCacheDirectory + this.selectFolder();
    console.log('copyTo',copyTo);


    await this.storage.get(this.selectFolder()).then((images) => {
      const arr = JSON.parse(images);
      if (!arr) {
        const newImages = [newName];
        this.storage.set(this.selectFolder(), JSON.stringify(newImages));
      } else {
        arr.push(newName);
        this.storage.set(this.selectFolder(), JSON.stringify(arr));
      }
    });

    await this.file.copyFile(origin, name, copyTo, newName);

    const newEntry = {
      name: newName,
      path: this.pathForImage(copyTo + "/" +newName),
      filePath: copyTo + "/" +newName,
    };

    this.images = [newEntry, ...this.images];

    return newEntry;

  }

  async captureImage(){
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    }

    this.processImage( options );
  }

  async pickImages(){
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.processImage( options );

  }

  processImage( options:CameraOptions ){
    this.camera.getPicture(options).then(( imgResp ) => {

      let base64Image = 'data:image/jpeg;base64,' + imgResp;
 
      this.imagePreview = window.Ionic.WebView.convertFileSrc(  imgResp  );

        this.copyFilesSeleted(base64Image, this.imagePreview).then((x) => {
          console.log("?",x);

        }).catch(err => { console.log(err) });
 
     }, (err) => {
       // Handle error
       console.log( 'Error al utilizar camara', JSON.stringify(err) );
  
     });
  }

  copyFileToLocalDir(fullPath, blob = null, fileName = "") {

    return new Promise<boolean>((resolve) => {
      if (fileName !== "") {
        console.log('1');
        this.file
          .writeFile(
            this.file.externalCacheDirectory + this.selectFolder(),
            fileName,
            blob,
            {
              replace: true,
            }
          )
          .then(
            (success) => {
              this.updateStoredImages(fileName).then((mensaje) => {
                resolve(true);
              });
            },
            (error) => {
              resolve(false);
              console.log("error: ", error);
            }
          );
      } else {
        let myPath = fullPath;

        const ext = myPath.split(".").pop();
        const d = Date.now();
        const newName = `${d}.${ext}`;

        const name = myPath.substr(myPath.lastIndexOf("/") + 1);
        console.log('name',name);
        const copyFrom = myPath.substr(0, myPath.lastIndexOf("/") + 1);
        console.log('copyFrom',copyFrom);
        const copyTo = this.file.externalCacheDirectory + this.selectFolder();
        console.log('copyTo',copyTo);
        console.log('newName',newName);

          this.file.writeFile(copyTo, newName, blob).then(
            (success) => {
              console.log('success');
              this.updateStoredImages(newName).then((mensaje) => {
                console.log('updateStoredImages:',mensaje);
                resolve(true);
              });
            },
            (error) => {
              resolve(false);
              console.log("error: ", error);
            }
          ).catch(err => console.log(err));

          console.log('11');
       
      }
    });
  }

  openImage(image) {

    this.photoViewer.show(image.filePath);
  }

  async openModal() {
    this.storage.set("Current_Folder", this.selectFolder());
    const modal = await this.modalController.create({
      component: DeleteModalPage,
    });
    modal.present();
    await modal.onWillDismiss();
    this.loading = true;
    this.loadImages();
  }

  async prepareFilesToUpload(orderId, isClose, isTemp, token) {
    console.log("Flag de temp ", isTemp);
    this.temp = isTemp === "false" ? false : true;
    console.log("El valor de la variable inter temp ", this.temp);
    this.closed = isClose === "false" ? false : true;
    console.log(this.selectFolder());
    await this.loadImages().then((mensaje) => {
      this.uploadFiles(orderId, isClose, isTemp, token);
    });

    // this.loadImages();
  }

  async uploadFiles(orderId, isClose, isTemp, token) {
    if (this.images.length < 1) {
      return;
    }
    for (var i = 0; i < this.images.length; i++) {
      try {
        const imageProccessed = await this.startUpload(
          this.images[i],
          orderId,
          isClose,
          isTemp,
          token
        );
      } catch (error) {
        console.log('uploadFiles.error',error);
      }
      
    }
  }

  async startUpload(imgEntry, orderId, isClose, isTemp, token) {
    console.log('antes del bug',imgEntry);
    this.file
      .resolveLocalFilesystemUrl(imgEntry.filePath)
      .then((entry) => {
        (<FileEntry>entry).file((file) =>
          this.readFile(file, orderId, isClose, isTemp, token)
        );
      })
      .catch((err) => {
        console.log("Error while reading file.", err);
      });
  }

  async readFile(file: any, orderId, isClose, isTemp, token) {
    const reader = new FileReader();
    reader.onload = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type,
      });
      formData.append("file", imgBlob, file.name);
      this.uploadImageData(formData, orderId, isClose, isTemp, token);
    };
    reader.readAsArrayBuffer(file);
  }

  async uploadImageData(formData: FormData, orderId, isClose, isTemp, token) {

    this.progress.percentage = 0;
    await this.uploadService
      .pushFileToStorage(formData, orderId, isClose, isTemp, token)
      .subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress.percentage = Math.round(
            (100 * event.loaded) / event.total
          );
        } else if (event instanceof HttpResponse) {
          // alert("File Successfully Uploaded");
        }
      });
  }
}
