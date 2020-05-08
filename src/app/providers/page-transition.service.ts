import { Injectable } from '@angular/core';
import { NativePageTransitions, NativeTransitionOptions, } from '@ionic-native/native-page-transitions';

@Injectable({
  providedIn: 'root'
})
export class PageTransitionService {

  constructor(private nativePageTransitions: NativePageTransitions) { }

  async ionViewWillLeave() {

    let options: NativeTransitionOptions = {
       direction: 'up',
       duration: 500,
       slowdownfactor: 3,
       slidePixels: 20,
       iosdelay: 100,
       androiddelay: 150,
       fixedPixelsTop: 0,
       fixedPixelsBottom: 60
      }
   
      var ret = await this.nativePageTransitions.slide(options)
   }
}
