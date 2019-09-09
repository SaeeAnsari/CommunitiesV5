import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StoryService } from '../../providers/story-service';
import { UserService } from '../../providers/user-service';
import { Firebase } from '@ionic-native/firebase/ngx'

import { PopoverController } from '@ionic/angular';


import { SocialSharingPopoverComponent } from '../../components/social-sharing-popover/social-sharing-popover.component';


/**
 * Generated class for the UserPostActionComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */

@Component({
  selector: 'app-user-post-action',
  templateUrl: 'user-post-action-component.component.html',
  styleUrls: ['./user-post-action-component.component.scss'],
  providers: [StoryService, UserService]
})
export class UserPostActionComponent implements OnInit {

  @Input() CommentCount: number;
  @Input() LikeCount: number;
  @Input() StoryID: number;
  @Input() UserID: number;
  @Input() MediaType: string;
  @Input() FeedType: string;
  @Input() EventID: string;

  @Output() ViewCommentsClicked = new EventEmitter();

  private likeClicked: boolean = false;


  constructor(private _storyService: StoryService,
    private _userService: UserService,
    public popoverCtrl: PopoverController,
    private firebase: Firebase) { }

  ngOnInit() {
    if (this.FeedType == "") {
      this.FeedType = "Story";
    }
  }

  setLike(storyID: number) {
    
    let userID = this._userService.GetLoggedInUserID();

    this.firebase.subscribe(storyID.toString()).then(data => {
      this._storyService.SetLike(storyID, userID).subscribe(sub => {
        if (sub != undefined && sub == true) {
          this.LikeCount++;
        }
      });
    });

  }

  viewComments(storyID: number) {

    this.ViewCommentsClicked.emit({
      storyID: storyID
    });
  }

  async presentPopover(myEvent) {
    if (this.FeedType == "Event" && this.EventID != '') {
      //Get the EventStoryID
      //Sent the Story to Sharing Control


      this._storyService.GetStoryByEventID(+this.EventID).subscribe(async sub => {

        var imageURL = "";
        if (sub.Images.length > 0) {
          imageURL = sub.Images[0];
        }

        let popover =  await this.popoverCtrl.create({
          component: SocialSharingPopoverComponent,
          componentProps: {
            storyID: sub.ID,
            mediaType: this.MediaType,
            longDescription: sub.LongDescription,
            imageURL: imageURL,
            storyExternalURL: sub.StoryExternalURL
          }
        });
        
        
        return popover.present();
      });

    }
    else if (this.FeedType == "Story") {

      //Call to get StoryDetails by ID

      this._storyService.GetStory(+this.StoryID).subscribe(async sub => {

        var imageURL = "";
        if (sub.Images.length > 0) {
          imageURL = sub.Images[0];
        }

        let popover = await this.popoverCtrl.create({
          component: SocialSharingPopoverComponent,
          componentProps: {
            storyID: sub.ID,
            mediaType: this.MediaType,
            longDescription: sub.LongDescription,
            imageURL: imageURL,
            storyExternalURL: sub.StoryExternalURL
          }
        });

        popover.present();
      });
    }
  }

  ionViewDidLoad() {
    console.log("Media TYpe: " + this.MediaType)
  }

  triggerAnimation() {
    this.likeClicked = true;
    setTimeout(() => {
      this.likeClicked = false;
    }, 1000);
  }
}
