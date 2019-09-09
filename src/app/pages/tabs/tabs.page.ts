import { Component } from '@angular/core';




import { CommunityPage } from '../community/community.page';
import { LiveFeedPage } from '../live-feed/live-feed.page';
import { EventFeedPage } from '../event-feed/event-feed.page';
import { MyCommunitiesPage } from '../my-communities/my-communities.page';
import { UserSearchPage } from '../user-search/user-search.page';
import { NotificationsPage } from '../notifications/notifications.page';
import { Firebase } from '@ionic-native/firebase/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { StoryService } from '../../providers/story-service';


import { BaseLinkProvider } from '../../providers/base-link/base-link';
import { Platform, Events, ToastController } from '@ionic/angular';
import { FirebaseMessagingProvider } from '../../providers/firebase-messaging/firebase-messaging';


@Component({
  templateUrl: 'tabs.page.html',
  providers: [StoryService, FirebaseMessagingProvider]
})
export class TabsPage {

  public notifications = [];
  public commentCount: number = 0;

  private file_transfer: FileTransferObject = this.transfer.create();

  tab0Root = LiveFeedPage;
  tab1Root = MyCommunitiesPage;
  tab2Root = EventFeedPage;
  tab3Root = NotificationsPage;

  constructor(
    private firebaseIonic: Firebase,
    private platform: Platform,
    private toast: ToastController,
    private ev: Events,
    private transfer: FileTransfer,
    private file: File,
    private _storyService: StoryService,
    private fcm: FirebaseMessagingProvider
  ) {
    this.onNotification();

    this.ev.subscribe('newVideoUpload', videoUpload => {

      var obj = JSON.parse(videoUpload);
      this.postVideo(videoUpload);

    });
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

    var vidExt =  fileName.split('.').pop();//Get the last item after .
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


  async onNotification() {
    try {

      let notificationsString = sessionStorage.getItem("userNotification");

      if (notificationsString != null && notificationsString.length > 3) {
        this.notifications = JSON.parse(notificationsString);
      }

      await this.platform.ready();

      this.firebaseIonic.onNotificationOpen().subscribe(sub => {
        console.log("Notification Opened");
        console.log(sub);
        this.notifications.push(sub);

        this.notifications = this.notifications.reverse();
        this.notifications = this.notifications.slice(0, 50);
        sessionStorage.setItem("userNotification", JSON.stringify(this.notifications));
        console.log("Checking coment count:")
        console.log(this.commentCount);
        this.commentCount = this.commentCount + 1;
        console.log(this.commentCount);

        sessionStorage.setItem("commentCount", this.commentCount.toString());
      });
    }
    catch (e) {
      console.log('erroring');
      console.log(e)
    }
  }

  notificationsClick() {
    //Dont know what to do here
  }
}