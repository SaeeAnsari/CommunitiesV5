import { Component, Input, OnInit } from '@angular/core';
import { CommunityPage } from '../../pages/community/community.page';
import { PopoverController, NavController, AlertController} from '@ionic/angular';
import { CreateTopicComponent } from '../../components/create-topic/create-topic.component';
import { ViewTopicsComponent } from '../../components/view-topics/view-topics.component';
import { SocialSharingPopoverComponent } from '../../components/social-sharing-popover/social-sharing-popover.component';
import { CommunityService } from '../../providers/community-service';
import {LiveFeedPage} from '../../pages/live-feed/live-feed.page';

/**
 * Generated class for the CommunityTopicMarkerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'community-topic-marker',
  templateUrl: 'community-topic-marker.component.html',
  styleUrls: ['./community-topic-marker.component.scss'],
  providers: [CommunityService]
})
export class CommunityTopicMarkerComponent implements OnInit {

  ionViewDidEnter() {

  }

  ngOnInit(): void {

    console.log("NgOnInit -- community-topic-marker");
    if (this.CommunityID > 0) {

      let userID = +sessionStorage.getItem('userID');

      this._communityService.GetCommunity(this.CommunityID).subscribe(sub => {

        if (sub.Type == 3 || sub.OwnerID != userID) { //Hide if in the Topic or not the Owner of the Community
          this.hideCreate = true;
        }

        if (sub.Type == 2) {//hide for the cities
          this.hideButtons = false;
        }

        if(sub.OwnerID == userID && sub.Type != 1){
          this.showDelete = true; //Only show delete if the owner is logged in and its not a City
        }
      });
    }
  }


  @Input() CommunityID: number;
  public communityCreated: boolean = false;
  public hideButtons: boolean = true;
  public hideCreate: boolean = false;
  public showDelete: boolean = false;

  constructor(

    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private _communityService: CommunityService,
    private alertCtrl: AlertController
  ) {

  }

  async createTopic(myEvent) {

    let createTopic = await this.popoverCtrl.create({
      component: CreateTopicComponent,
      componentProps: { CommunityID: this.CommunityID }
    });

    if (this.CommunityID > 0) {

      createTopic.onDidDismiss().then(data => {

        if (data.data != null && data.data.CommunityID > 0) {
          this.communityCreated = true;
          this.showDelete = false;
          setTimeout(() => {
            this.communityCreated = false;
            this.showDelete = true;
          }, 5000);
        }
      })
      return await createTopic.present();
    }
  }

  async viewTopics(myEvent) {
    let viewTopic = await this.popoverCtrl.create({
      component: ViewTopicsComponent, 
      componentProps: { CommunityID: this.CommunityID}
    })

    if (this.CommunityID > 0) {

      viewTopic.present();
    }
  }

  async presentConfirmDelate() {
    let alert = await this.alertCtrl.create({      
      message: 'Deleting cannot be undone, are you sure you want to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            console.log('Delete clicked');
            this._communityService.DeleteCommunity(this.CommunityID).subscribe(sub=>{
              if(sub != null){
                if(sub == -1){
                  this.navCtrl.navigateForward('/tabs');
                }
                else if(sub > 0){
                  this.navCtrl.navigateForward('/tabs/' + sub);
                }
              }
            });
          }
        }
      ]
    });
    alert.present();
  }
}
