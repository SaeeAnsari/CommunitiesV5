import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../providers/user-service';
import { NewCommentComponent } from '../new-comment-component/new-comment-component.component';
import {NewEventComponent} from '../new-event/new-event.component';


import { ModalController } from '@ionic/angular';


/**
 * Generated class for the MarkerNewPostComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'app-marker-new-post',
  templateUrl: 'marker-new-post-component.component.html',
  styleUrls: ['./marker-new-post-component.component.scss'],
  providers: [UserService]
})
export class MarkerNewPostComponent implements OnInit {

  @Input() StoryID: number = 0;
  @Input() FeedType: string;
  @Input() CommunityID: number = 0;
  @Output() OnStorySave = new EventEmitter();

  private user;
  constructor(private _userService: UserService, public modalCtrl: ModalController) { }

  ngOnInit() {
    this.loadNewPostMarker();
  }

  loadNewPostMarker() {
    this._userService.getLoggedinInUser().subscribe(s => {

      this.user = s;

    });
  }

  async redirecttoNewPost() {

    if(this.FeedType == "Event"){

      let eventsModal = await this.modalCtrl.create({component:NewEventComponent, 
      componentProps:{ storyID: this.StoryID, FeedType: this.FeedType }}); 
        

        eventsModal.onDidDismiss().then(data => {

        if (data) {
          this.StoryID = data.data.storyID;
          this.OnStorySave.emit();
        }
      });
      eventsModal.present();
    }
    else{

    
    
      let commentsModal = await this.modalCtrl.create({component: NewCommentComponent,
      componentProps: { storyID: this.StoryID, FeedType: this.FeedType ,CommunityID: this.CommunityID }});  

      commentsModal.onDidDismiss().then(data => {

        if (data) {
          this.StoryID = data.data.storyID;
          this.OnStorySave.emit();
        }
      });
      commentsModal.present();
    }
  }

}
