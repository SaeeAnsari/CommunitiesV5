import { Component } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { UserCommentsComponent } from '../../components/user-comments-component/user-comments-component.component';
import { StoryService } from '../../providers/story-service';
//import { NativeStorage} from '@ionic-native/native-storage/ngx';
import { Storage } from '@ionic/storage';

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
    let notificationString = localStorage.getItem("userNotification");

    if (notificationString != null && notificationString.length > 3) {
      this.notifications = JSON.parse(notificationString);
      console.log("All Notifications");
      console.log(notificationString);
    }

    //this.notifications = [{"title":"Saeed Ansari Sent a Message","body":"Hey What is this all about","id":"0:1594049344228084%36e44fed36e44fed","storyID":"1628","timestamp":"1,594,049,343,647","isRead":false},{"title":"Saeed Ansari Sent a Message","body":"Hey What is this all about 2","id":"0:1594049588757654%36e44fed36e44fed","storyID":"1628","timestamp":"1,594,049,588,225","isRead":false}];    
    
    var countList = this.notifications.filter(ret=>{
      return ret.isRead == false;
    })
    
    if(countList == null){
      this.commentCount = null;
    }
    else{
      this.commentCount = countList.length;            
    }        
    this.storyService.setCountValue(this.commentCount);
  }

  async notificationClicked(elem) {

    this.loadNotifications();

    this.updateNotificationRead(elem.id);

    this.storyService.GetStory(elem.storyID).subscribe(async story => {
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
          componentProps: { storyID: elem.storyID, postMediaURL: postMediaURL, postMessage: story.LongDescription, storyExternalURL: story.StoryExternalURL, type: type }
        })       

        commentsModal.present();
      }
    })
  }

  private updateNotificationRead(id) {
    for (let index = 0; index < this.notifications.length; index++) {
      if(this.notifications[index].id == id){
        this.notifications[index].isRead = true;          
      }          
    }    

    localStorage.setItem("userNotification", JSON.stringify(this.notifications));
    try {

      var commentCount = this.notifications.filter(ret=> ret.isRead == false);
      this.storyService.setCountValue(commentCount.length.toString());          
      
    } catch (error) {
      console.log("Notifications: Error in getting Count " + JSON.stringify(error));  
    }    
  }
}
