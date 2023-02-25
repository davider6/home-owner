import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageProfile'
})
export class ImageProfilePipe implements PipeTransform {

  transform( imageProfile: string ): any {
    
    if ( !imageProfile || imageProfile === "" ){
      return "assets/profiles/profile5.png";
    }
    
    return imageProfile;
  }

}
