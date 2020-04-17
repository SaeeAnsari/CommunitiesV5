import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { LiveFeedPage } from '../../pages/live-feed/live-feed.page';

import { IonSlides } from '@ionic/angular';
import { NavController, NavParams } from '@ionic/angular';
import { UserService } from '../../providers/user-service';
import { CommunityService } from '../../providers/community-service';
import { Router, NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-communities-slides-v2',
  templateUrl: './communities-slides-v2.component.html',
  styleUrls: ['./communities-slides-v2.component.scss'],
  providers: [CommunityService, UserService]
})
export class CommunitiesSlidesV2Component implements OnInit {

  @ViewChild('slideWithNav', {static: false}) slideWithNav: IonSlides;
  @ViewChild('slideWithNav2', {static: false}) slideWithNav2: IonSlides;
  @ViewChild('slideWithNav3', {static: false}) slideWithNav3: IonSlides;


  @Output() CommunityChanged = new EventEmitter();
  
  sliderOne: any;
  sliderTwo: any;
  sliderThree: any;
 
 
  //Configuration for each Slider
 
  slideOptsThree = {
    initialSlide: 0,
    slidesPerView: 3
  };



  constructor( 
    public router: Router,
    private _userService: UserService,
    private _searchService: CommunityService,
    public navCtrl: NavController
    ) { 
    //Item object for Nature
    this.sliderOne =
      {
        isBeginningSlide: true,
        isEndSlide: false,
        slidesItems: [
          {
            id: 1,
            image: '../../assets/images/1.jpg'
          },
          {
            id: 2,
            image: '../../assets/images/2.jpg'
          },
          {
            id: 3,
            image: '../../assets/images/3.jpg'
          },
          {
            id: 4,
            image: '../../assets/images/4.jpg'
          },
          {
            id: 5,
            image: '../../assets/images/5.jpg'
          }
        ]
      };
    //Item object for Food
    this.sliderTwo =
      {
        isBeginningSlide: true,
        isEndSlide: false,
        slidesItems: [
          {
            id: 6,
            image: '../../assets/images/6.jpg'
          },
          {
            id: 7,
            image: '../../assets/images/7.jpg'
          },
          {
            id: 8,
            image: '../../assets/images/8.jpg'
          },
          {
            id: 9,
            image: '../../assets/images/9.jpg'
          },
          {
            id: 10,
            image: '../../assets/images/10.jpg'
          }
        ]
      };
    //Item object for Fashion
    this.sliderThree =
      {
        isBeginningSlide: true,
        isEndSlide: false,
        slidesItems: [
          
        ]
      };

      var activeCommunityID = sessionStorage.getItem("activeCommunity");

      let userID = this._userService.GetLoggedInUserID();
  
      this._searchService.GetUserRegisteredCommunities(userID)
        .subscribe(sub => {
  
          sub.forEach(element => {
  
            if (activeCommunityID != element.ID) {
  
              var community = {
                id: element.ID,
                name: element.Name,
                description: element.Description,
                ownerID: element.OwnerID,
                typeName: 'City',
                imageURL: element.ImageURL
              };
  
              if (community.imageURL != "") {
                community.imageURL.replace("/upload/", "/upload/w_30,c_thumb/")
              }
  
              this.sliderThree.slidesItems.push(community);
            }
          });
  
  
          console.log("Communities Slide V2: After Pushing the Communities into array");
          console.log(this.sliderThree);
        });
  }



  goToCommunity(communityID) {
    if (communityID > 0) {

      let userID: number = this._userService.GetLoggedInUserID();
      //this._communityService.UpdateCommunityRank(this.ID, userID).subscribe();     

      this.CommunityChanged.emit({communityID: communityID});

      //this.router.navigate(['tabs/tab1'], navigationExtras);
    }
  }



  ngOnInit() { }

  
  //Move to Next slide
  slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }
 
  //Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });;
  }
 
  //Method called when slide is changed by drag or navigation
  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }
 
  //Call methods to check if slide is first or last to enable disbale navigation  
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }
 
  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }

}
