import { Injectable } from '@angular/core';


/*
  Generated class for the BaseLinkProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable({ providedIn: 'root' })
export class BaseLinkProvider {

  constructor() {
    
  }

  static GetBaseUrl() {
   //return 'http://localhost/change.api/api';
    
    return 'http://saeedansari-001-site6.itempurl.com/api';
    //return 'http://localhost/Change.API/api';
  }

  static GetMediaURL(){
    //return "http://localhost/Change.API/";
    
    return 'http://saeedansari-001-site2.itempurl.com/';  
  }
}
