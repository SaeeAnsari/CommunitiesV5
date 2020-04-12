import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { StoryService } from '../../providers/story-service';


import { User } from '../../interfaces/user';
import { MediaPostService } from '../../providers/media-post-service';
import { CommunityService } from '../../providers/community-service';
import { UserService } from "../../providers/user-service";

import { CameraPluginProvider } from '../../providers/camera-plugin/camera-plugin';


import { ModalController, NavParams, NavController, Events } from '@ionic/angular';
import { OpenGraphServiceProvider } from '../../providers/open-graph-service/open-graph-service';
import { UserMessageService } from '../../providers/user-message.service';

import { Keyboard } from '@ionic-native/keyboard/ngx';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FirebaseMessagingProvider } from '../../providers/firebase-messaging/firebase-messaging';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { BaseLinkProvider } from 'src/app/providers/base-link/base-link';



@Component({
  selector: 'new-comment-component',
  templateUrl: 'new-comment-component.component.html',
  styleUrls: ['./new-comment-component.component.scss'],
  providers: [UserService, FirebaseMessagingProvider, StoryService, MediaPostService, CommunityService, OpenGraphServiceProvider, CameraPluginProvider, WebView]
})
export class NewCommentComponent implements OnInit {


  private user;
  public uploaded: boolean = false;
  private postText: string = "";
  private postTextUploaded: string = "";
  public mediaType: string = "";
  public uploadedMediaURL: string = "";


  public videoObj: any;
  public imageListObj = [];

  private videoSelected: boolean = false;
  private imageSelected: boolean = false;

  private activeCommunity;

  private userCommunities = [];

  PostTextControl = new FormControl();


  private optionsModel: number[] = [];


  private graphFound: boolean = false;
  private graphDescription: string = "";
  private graphTitle: string = "";
  private graphImage: string = "";
  private graphExternalURL: string = "";
  private videoMimeType: string = "";


  private keyboardShowing: boolean;




  constructor(
    private _userService: UserService,
    private _storyService: StoryService,
    private _mediaPost: MediaPostService,
    private _community: CommunityService,
    public nav: NavController,
    public vc: ModalController,
    public navParams: NavParams,
    private _openGraphApi: OpenGraphServiceProvider,
    private transfer: FileTransfer,
    private file: File,
    private cameraPluginServices: CameraPluginProvider,
    private keyboard: Keyboard,
    private fcm: FirebaseMessagingProvider,
    private webview: WebView,
    private ev: Events,
    private messaging: UserMessageService
  ) {


  }

  ngOnInit() {
    //IONIC 4 dropped this functionality
    //this.keyboard.disableScroll(true);
    this.keyboard.onKeyboardShow().subscribe(sub => {
      this.keyboardShowing = true;
    });

    this.keyboard.onKeyboardHide().subscribe(sub => {
      this.keyboardShowing = false;
    });


    this._userService.getLoggedinInUser().subscribe(sub => {

      this.user = {
        id: sub.ID,
        displayName: sub.DisplayName,
        imageURL: sub.ImageURL,
        defaultCommunityID: sub.DefaultCommunityID
      };

      this.activeCommunity = this.user.defaultCommunityID;

      if (this.navParams.get("CommunityID")) {
        this.activeCommunity = this.navParams.get("CommunityID");
      }

      /*
      if (sessionStorage.getItem("activeCommunity") != null) {

        this.activeCommunity = sessionStorage.getItem("activeCommunity").toString();
      }
      */
      this.optionsModel.push(this.activeCommunity);

      this._community.GetUserCommunities(this.user.id).subscribe(sub => {

        this.userCommunities = [];

        //set the array
        sub.forEach(element => {

          this.userCommunities.push({ id: element.ID, name: element.Name });
        });


      });
    });

    this.listenToGraph();

  }

  listenToGraph() {
    this.PostTextControl.valueChanges
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe(va => {
        let uri = this._openGraphApi.checkIfURLExist(this.postText);

        if (uri != "") {
          this._openGraphApi.GetOpenGraphDetails(uri).subscribe(sub => {
            if (sub.hybridGraph) {
              this.graphDescription = sub.hybridGraph.description;
              this.graphTitle = sub.hybridGraph.title;
              this.graphImage = sub.hybridGraph.image;
              this.graphFound = true;
              this.graphExternalURL = sub.hybridGraph.url;

              this.postText = this.graphTitle;
              this.mediaType = "Image";

              if (this.graphImage.length > 0) {
                this.imageListObj.push(
                  {
                    id: -1,
                    url: this.graphImage
                  }
                )
              }
            }
          });
        }
      });
  }


  private dataMediaType: string = '';

  mediaSelectedForPosting(data) {
    if (data != null) {
      console.log("Got Data: " + JSON.stringify(data));

      this.dataMediaType = data.mediaType;

      if (data.mediaType == "Video") {

        this.videoObj = {
          id: -1,
          url: data.fileName,
          name: data.name,
          publicID: data.publicID,
          versionID: data.versionID
        }

        this.uploadedMediaURL = this.webview.convertFileSrc(data.fileName);
        this.videoMimeType = data.mimeType;
      }
      else if (data.mediaType == "Image") {

        data.imageList.forEach(element => {
          this.imageListObj.push(
            {
              id: -1,
              url: element.fileName,
              publicID: element.publicID,
              versionID: element.versionID
            }
          )

          this.uploadedMediaURL = this.webview.convertFileSrc(element.fileName);
        });

      }

      this.mediaType = data.mediaType;
      this.uploaded = true;
    }
  }

  post() {

    if (this.user && (this.postText != '' || (this.imageListObj != null && this.imageListObj.length > 0) || this.videoObj != null)) {

      let storyText = this.postText == "" ? this.postTextUploaded : this.postText;


      if (this.videoObj != null && this.mediaType == "Video") {
        let videoPost = {
          UserID: this.user.id,
          StoryText: storyText,
          MediaType: this.mediaType,
          OptionsModel: this.optionsModel,
          ImageListObj: this.imageListObj,
          GraphExternalURL: this.graphExternalURL,
          UploadedMediaURL: this.uploadedMediaURL,
          VideoMimeType: this.videoMimeType,

        };

        let id = 0;
        this.uploaded = false;
        this.postText = "";
        this.postTextUploaded = "";
        this.mediaType = "";
        this.videoSelected = false;
        this.imageSelected = false;

        this.messaging.presentToast("Saving your post, just a sec...");
        this.vc.dismiss({ storyID: -1 });

        /*this.optionsModel = [];
        this.optionsModel.push(this.user.defaultCommunityID);

        if (this.user.defaultCommunityID > 0) {
          let activeCommunity = this.user.defaultCommunityID;
          if (sessionStorage.getItem("activeCommunity") != null) {

            activeCommunity = +sessionStorage.getItem("activeCommunity")
          }
        }
        */

        let options = {
          fileKey: 'file',
          fileName: this.videoObj.url,
          mimeType: this.videoMimeType,
          chunkedMode: false,
          headers: {
            'Content-Type': undefined
          },
          params: {}
        };


        console.log("New Comment: VideoURL" + this.videoObj.url);
        console.log(options);

        var results = this._storyService.uploadMedia(this.videoObj.url, options, "Story", this.dataMediaType);
        console.log("New Comment: Uploaded Result " + results);
        results.then(result => {


          console.log("New Comment: Video Uploaded");
          var parsingString = result.response;

          var fileName = parsingString.substring(parsingString.indexOf("<FileName>"), parsingString.indexOf("</FileName>")).replace("<FileName>", "");
          var publicID = parsingString.substring(parsingString.indexOf("<PublicID>"), parsingString.indexOf("</PublicID>")).replace("<PublicID>", "");
          var versionID = parsingString.substring(parsingString.indexOf("<VersionID>"), parsingString.indexOf("</VersionID>")).replace("<VersionID>", "")
          var videoThumbURL = parsingString.substring(parsingString.indexOf("<ThumbURL>"), parsingString.indexOf("</ThumbURL>")).replace("<ThumbURL>", "")

          console.log("New Comment : FileName " + fileName);

          //var vidExt =  fileName.split('.').pop();//Get the last item after .
          //Renaming the Video extension to something more compatibl on mobile and web systems
          //fileName = fileName.replace('.' + vidExt, '.3gp');
          this.videoObj.url = fileName;
          this.videoObj.publicID = publicID;
          this.videoObj.versionID = versionID;

          console.log("New Comment : FileName" + fileName);

          this._storyService.SavePost(this.user.id,
            storyText, "Video", this.optionsModel, this.videoObj, this.imageListObj, this.graphExternalURL).subscribe(sub => {

              console.log("VIdeo Obj : " + JSON.stringify(this.videoObj));
              this.postPostActions(sub);
            });
        });
      }
      else if (this.mediaType == "Image") {
        this.imageListObj.forEach(element => {

          let options = {
            fileKey: 'file',
            fileName: element.url,
            mimeType: 'image/jpeg',
            chunkedMode: false,
            headers: {
              'Content-Type': undefined
            },
            params: {}
          };

          console.log("New Comment : URI " + element.url);

          //this.ev.publish("post:ImagePost", JSON.stringify(options));          
          let results = this._storyService.uploadMedia(element.url, options, "Story", this.dataMediaType);
          console.log("New Comment: Uploaded Result " + results);
          results.then(result => {
            console.log("Return variable");
            console.log(result);

            var parsingString = result.response;
            var fileName = parsingString.substring(parsingString.indexOf("<FileName>"), parsingString.indexOf("</FileName>")).replace("<FileName>", "");
            var publicID = parsingString.substring(parsingString.indexOf("<PublicID>"), parsingString.indexOf("</PublicID>")).replace("<PublicID>", "");
            var versionID = parsingString.substring(parsingString.indexOf("<VersionID>"), parsingString.indexOf("</VersionID>")).replace("<VersionID>", "")
            console.log("New Comment : Filename " + fileName);
            console.log(fileName);

            this.imageListObj[0].url = fileName;
            console.log(this.imageListObj);

            console.log("New Comment: Commnunities Selected ");
            console.log(this.optionsModel);

            this._storyService.SavePost(this.user.id,
              storyText, this.mediaType, this.optionsModel, this.videoObj, this.imageListObj, this.graphExternalURL).subscribe(sub => {

                this.postPostActions(sub);
              });
          })

          this.messaging.presentToast("Saving your post, just a sec...");
          this.vc.dismiss({ storyID: -1 });
        });
      }
      else {
        this._storyService.SavePost(this.user.id,
          storyText, this.mediaType, this.optionsModel, this.videoObj, this.imageListObj, this.graphExternalURL).subscribe(sub => {

            this.postPostActions(sub);
          });
      }
    }
  }

  postPostActions(sub) {
    console.log("New Comment : Story Saved - StoryID = " + sub)
    let id = sub;
    this.uploaded = false;
    this.postText = "";
    this.postTextUploaded = "";
    this.mediaType = "";
    this.videoSelected = false;
    this.imageSelected = false;

    this.fcm.SubscibeToTopic(id.toString());

    this.vc.dismiss({ storyID: id });


    this.optionsModel = [];
    this.optionsModel.push(this.user.defaultCommunityID);

    if (this.user.defaultCommunityID > 0) {

      let activeCommunity = this.user.defaultCommunityID;

      if (sessionStorage.getItem("activeCommunity") != null) {

        activeCommunity = +sessionStorage.getItem("activeCommunity")
      }
    }

  }

  closeModal() {

    this.vc.dismiss();
  }


}
