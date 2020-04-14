import { Component } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { UserCommentsComponent } from '../../components/user-comments-component/user-comments-component.component';
import { StoryService } from '../../providers/story-service';
//import { NativeStorage} from '@ionic-native/native-storage/ngx';
import {Storage} from '@ionic/storage';


@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.page.html',
  styleUrls: ['./notifications.page.scss'],  
  providers: [StoryService]
})
export class NotificationsPage {

  public notifications = [];


  public commentCount: number = 0;

  constructor(
    public navCtrl: NavController,
    public storyService: StoryService,
    public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }

  ionViewDidEnter() {
    this.loadNotifications();
  }

  loadNotifications() {
    console.log("Inside Notifiation On Enter");
    let notificationString = sessionStorage.getItem("userNotification");

    if (notificationString != null && notificationString.length > 3) {
      this.notifications = JSON.parse(notificationString);
      console.log("All Notifications");
      console.log(notificationString);
    }

    this.commentCount = +sessionStorage.getItem("commentCount");

    //this.notifications = [{ "storyID": "1430", "google.sent_time": 1512245779130, "tap": true, "from": "/topics/1430", "text": "sdsds", "timestamp": "12/2/2017 12:16:19 PM", "title": "Saddie West", "google.message_id": "0:1512245779448176%36e44fec36e44fec", "collapse_key": "com.ionicframework.communities54284" }, { "storyID": "1431", "google.sent_time": 1512245776812, "tap": true, "from": "/topics/1430", "text": "sdsdd", "timestamp": "12/2/2017 12:16:16 PM", "title": "Saddie West", "google.message_id": "0:1512245777141663%36e44fec36e44fec", "collapse_key": "com.ionicframework.communities54284" }];
  }

  async notificationClicked(storyID) {

    this.loadNotifications();

    let storyIndexSplice = this.notifications.indexOf(this.notifications.filter(item => item.storyID == storyID));
    this.notifications.splice(storyIndexSplice, 1);


    this.storyService.GetStory(storyID).subscribe(async story => {
      if (story != null) {
        let type = story.MediaType;

        let postMediaURL;

        if (type == "Image" && story.Images.length > 0) {
          postMediaURL = story.Images;
        }
        else if (type == "Video" && story.Video != null) {
          postMediaURL = story.Video.VideoIdentifier;
        }

        let commentsModal = await this.modalCtrl.create({
          component: UserCommentsComponent,
          componentProps: { storyID: storyID, postMediaURL: postMediaURL, postMessage: story.LongDescription, storyExternalURL: story.StoryExternalURL, type: type }
        })

        //let commentsModal = this.modalCtrl.create(UserCommentsComponent,
        //  { storyID: storyID, postMediaURL: postMediaURL, postMessage: story.LongDescription, storyExternalURL: story.StoryExternalURL, type: type },
        //  { showBackdrop: true, enableBackdropDismiss: true });

        commentsModal.present();
      }
    })
  }
}
