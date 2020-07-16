import { Component, OnInit } from '@angular/core';
import { UserService } from '../providers/user-service';
import { NavController, Platform, ModalController, PopoverController } from '@ionic/angular';
//import { FCM } from '@ionic-native/fcm/ngx';
import { MenuComponent } from '../components/menu/menu.component';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from '@capacitor/core';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';


import { ErrorLogServiceProvider } from '../providers/error-log-service/error-log-service';
import { Router } from '@angular/router';
import { FirebaseMessagingProvider } from '../providers/firebase-messaging/firebase-messaging';
import { StoryService } from '../providers/story-service';

import { BaseLinkProvider } from '../providers/base-link/base-link';
import { getLocaleDateTimeFormat } from '@angular/common';
import { count } from 'rxjs-compat/operator/count';

import {Events} from '../providers/events.service';




const { PushNotifications } = Plugins;

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  ngOnInit(): void {

    //this.commentCount=2;

    console.log("TABS - Page Init Fired")
    this.registerPushNotificationHooks();   
  }

  public registerPushNotificationHooks() {
    //https://capacitor.ionicframework.com/docs/guides/push-notifications-firebase/
    
    
    PushNotifications.requestPermissions().then(result => {
      PushNotifications.register();
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        console.log("tabs: fcm: Getting Token -- Success " + token.value);
        sessionStorage.setItem("messagingToken", token.value);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        this.error.UXLogError("Tabs", error);
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        console.log("Tabs -- " + "Push received: " + JSON.stringify(notification));
        this.onNotification(notification);
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        console.log("Tabs -- " + "Push Action Performed: " + JSON.stringify(notification));
        this.onNotification(notification);
        this.router.navigate(['tabs/Notifications']);
      }
    );


    /*
    setInterval(() => {

      let notificationsString = localStorage.getItem("userNotification");

      if (notificationsString != null && notificationsString.length > 3) {
        this.notifications = null;
        this.notifications = JSON.parse(notificationsString);
      }     
      this.commentCount = this.notifications.length;
      console.log("Tabs - Inside the SetInterval method");

    }, 5000);
    */
    
  }
  

  private file_transfer: FileTransferObject = this.transfer.create();
  public notifications = [];
  public commentCount = 0;

  constructor(userService: UserService,
    navCtrl: NavController,
    //private firebaseIonic: FCM,
    private modal: ModalController,
    private platform: Platform,
    private popoverCtrl: PopoverController,
    private error: ErrorLogServiceProvider,
    private router: Router,
    private ev: Events,
    private _storyService: StoryService,
    private fcm: FirebaseMessagingProvider,
    private transfer: FileTransfer,
    private file: File
  ) {

    if (userService.GetLoggedInUserID() <= 0) {
      navCtrl.navigateBack("/login");
    }

    this.ev.subscribe('newVideoUpload', videoUpload => {

      var obj = JSON.parse(videoUpload);
      this.postVideo(videoUpload);
    });      

    this.ev.subscribe('messageCountPublished', ret=>{
      console.log("TABS: new count received " + ret)

      this.commentCount = ret;

    })
  }

  async postVideo(videoObject) {

    let url = BaseLinkProvider.GetBaseUrl() + "/Video";

    let postVideoObject = JSON.parse(videoObject);

    console.log("Main Video Object: " + JSON.stringify(videoObject));
    console.log(videoObject);

    //Since this is a device components there has been isssue with this item disappearing, so we get it form local cache
    let uploadVideoFilePath = localStorage.getItem('uploadVideoFilePath');
    let uploadVideoFileName = localStorage.getItem('uploadVideoFileName');

    let options = {
      fileKey: 'file',
      fileName: uploadVideoFileName,
      mimeType: videoObject.VideoMimeType,
      chunkedMode: false,
      headers: {
        'Content-Type': undefined
      },
      params: {}
    };

    let result = await this.file_transfer.upload(
      encodeURI(uploadVideoFilePath),
      encodeURI(url),
      options,
      false
    );

    var parsingString = result.response;

    var fileName = parsingString.substring(parsingString.indexOf("<FileName>"), parsingString.indexOf("</FileName>")).replace("<FileName>", "");
    var publicID = parsingString.substring(parsingString.indexOf("<PublicID>"), parsingString.indexOf("</PublicID>")).replace("<PublicID>", "");
    var versionID = parsingString.substring(parsingString.indexOf("<VersionID>"), parsingString.indexOf("</VersionID>")).replace("<VersionID>", "")
    var videoThumbURL = parsingString.substring(parsingString.indexOf("<ThumbURL>"), parsingString.indexOf("</ThumbURL>")).replace("<ThumbURL>", "")

    var vidExt = fileName.split('.').pop();//Get the last item after .
    //Renaming the Video extension to something more compatibl on mobile and web systems
    fileName = fileName.replace('.' + vidExt, '.3gp');

    let videoObj = {
      id: -1,
      url: fileName,
      publicID: publicID,
      versionID: versionID
    }

    this._storyService.SavePost(
      postVideoObject.UserID,
      postVideoObject.StoryText,
      postVideoObject.MediaType,
      postVideoObject.OptionsModel,
      videoObj,
      postVideoObject.ImageListObj,
      postVideoObject.GraphExternalURL).subscribe(sub => {
        this.fcm.SubscibeToTopic(sub);
        console.log("tabs--Post Saved");
      });
  }


  private onNotification(notificationData) {
    try {

      console.log("TABS: Inside Notification...");

      let notificationsString = localStorage.getItem("userNotification");
      
      if (notificationsString != null && notificationsString.length > 3) {
        this.notifications = JSON.parse(notificationsString);
      }      

      console.log("TABS: Notification Data");
      console.log(notificationData)

      var item = {
        title: notificationData.data.title,
        body: notificationData.data.body,
        id: notificationData.id,
        storyID : notificationData.data.storyID,
        timestamp: Date.now(),
        isRead: false
      };      

      console.log("FCM: Received new FCM notifications");
      console.log(item);

      this.notifications.push(item);
      localStorage.setItem("userNotification", JSON.stringify(this.notifications));

      var countList = this.notifications.filter(ret=>{
        return ret.isRead == false;
      })
      
      this.commentCount = countList.length;      
      this._storyService.setCountValue(this.commentCount);      
      console.log("TABS: Published new notification");
    }
    catch (e) {
      console.log('TABS : ' + JSON.stringify(e));      
    }
  }

  async launchSettingsModel(ev: any) {



    let popover = await this.popoverCtrl.create({
      component: MenuComponent,
      event: ev,
      translucent: true,
      componentProps: {
        onDismiss: () => {
          popover.dismiss();
        }
      }
    });


    popover.present();

  }
}
