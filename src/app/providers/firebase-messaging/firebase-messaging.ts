import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
//import { FCM } from '@ionic-native/fcm/ngx';

import {StoryService} from '../story-service';
// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { Plugins } from "@capacitor/core";
const { PushNotifications } = Plugins;
 
//
// with type support
import { FCM } from "capacitor-fcm";
const fcm = new FCM();
 
//
// alternatively - without types
const { FCMPlugin } = Plugins;


/*
  Generated class for the FirebaseMessagingProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable({ providedIn: 'root' })
export class FirebaseMessagingProvider {

  private _url: string = 'https://fcm.googleapis.com/v1/projects/communities-386e8/messages:send';
  private messagingToken: string;

  constructor(
    public http: Http,
    public storyService: StoryService
  ) {

  }




  public SubscibeToTopic(topic): Promise<any> {
    return fcm.subscribeTo({ topic: topic});    
  }


  public SendNotificationToTopic(storyID: number, title: string, body: string): Observable<any> {
    return this.storyService.SendPushMessage(storyID, title, body);    
  }
  

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error("fcm: " + errMsg);
    console.log("fcm: " + error._body);
    return Observable.throw(errMsg);
  }

}
