import { NoDataComponent } from "./no-data/no-data.component";
import { BannerComponent } from "./banner/banner.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PopemailComponent } from "./popemail/popemail.component";
import { RatingComponent } from "./rating/rating.component";
import { ImageSliderComponent } from "./image-slider/image-slider.component";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [
    RatingComponent,
    ImageSliderComponent,
    PopemailComponent,
    BannerComponent,
    NoDataComponent,
  ],
  exports: [
    RatingComponent,
    ImageSliderComponent,
    PopemailComponent,
    BannerComponent,
    NoDataComponent,
  ],
})
export class SharedModule {}
