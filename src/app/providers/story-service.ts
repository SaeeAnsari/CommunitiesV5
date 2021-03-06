import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { BaseLinkProvider } from '../providers/base-link/base-link';
import { Observable } from 'rxjs/Observable';

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
import { FileTransferObject, FileTransfer } from '@ionic-native/file-transfer/ngx';

import {BehaviorSubject} from 'rxjs';

import {Events} from '../providers/events.service';


/*
  Generated class for the StoryService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable({ providedIn: 'root' })
export class StoryService {

  public messagingCount = new BehaviorSubject(0);

  private _url = BaseLinkProvider.GetBaseUrl() + '/Story';

  private file_transfer: FileTransferObject = this.transfer.create();

  headers: Headers;

  constructor(private _http: Http, private transfer: FileTransfer, private ev: Events) {
  }



  public GetStory(id: number) {
    return this._http.get(this._url + '/' + id)
      .map(ret => ret.json());
  }

  public SetLike(storyID: number, userID: number, commentID?: number): Observable<any> {

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let data = new URLSearchParams();

    let appendURL: string = '';

    appendURL = '/SetLike?storyID=' + storyID + '&commentID=' + commentID + '&userID=' + userID;

    return this._http.post(
      this._url + appendURL,
      data,
      { headers: this.headers }
    ).map(res => res.json())
      .catch(this.handleError)
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    console.log(error._body);
    console.log("Error BIG : " + JSON.stringify(error));
    return Observable.throw(errMsg);
  }

  GetStoriesByCommunity(communityID: number, pageIndex: number): Observable<any> {

    return this._http.get(this._url + '?communityID=' + communityID + '&pageIndex=' + pageIndex)
      .map(post => post.json())
      .catch(this.handleError);
  }

  SavePost(
    userID: number,
    postText: string,
    mediaType: string,
    selectedCommunities: number[],
    video: any,
    images: any,
    storyExternalURL: string
  ): Observable<any> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');



    let logObject = {
      userID: userID,
      postText : postText,
      mediaType: mediaType,
      selectedCommunities : selectedCommunities,
      video: video,
      images: images,
      storyExternalURL: storyExternalURL
    }

    console.log("Story Service : SavePost");
    console.log(logObject);



    let videoTag;
    let imageURL = '';

    if (mediaType == "Video" && video != null) {
      videoTag = {
        ID: -1,
        VideoIdentifier: video.url,
        HostProvider: 1,
        PublicID: video.publicID,
        VersionID: video.versionID
      }
    }
    else {
      videoTag = {
        ID: -1,
        VideoIdentifier: '',
        HostProvider: 0,
        PublicID: "",
        VersionID: ""
      };
    }

    let imageList = [];
    if (mediaType == "Image" && images != null) {
      images.forEach(element => {
        imageList.push(
          {
            ID: -1,
            ImageURL: element.url,
            StoryID: -1,
            Active: true,
            PublicID: element.publicID,
            VersionID: element.versionID
          }
        )
      });
    }


    let data = {
      ID: -1,
      UserID: userID,
      LongDescription: postText,
      Video: videoTag,
      CommunityIDs: [],
      ImageURL: imageURL,
      StoryExternalURL: storyExternalURL,
      Images: imageList
    };
    if (selectedCommunities.length > 0) {
      data.CommunityIDs = selectedCommunities;
    }


    console.log("This is what i am sending SAVE POST :" + JSON.stringify(data));

    return this._http.post(
      this._url + '/InsertStory',
      data
      ,
      { headers: this.headers }
    ).map(res => res.json())
      .catch(this.handleError)
  }

  public ShareStory(storyID: number, userID: number, communityIDs: number[]): Observable<any> {

    let _shareURL = BaseLinkProvider.GetBaseUrl() + '/StoryShare'
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let data = {
      StoryID: storyID,
      UserID: userID,
      CommunityID: communityIDs
    };

    return this._http.post(
      _shareURL,
      data,
      { headers: this.headers }
    ).map(res => res.json())
      .catch(this.handleError)
  }

  GetStoryByEventID(eventID: number): Observable<any> {

    return this._http.get(this._url + '?eventID=' + eventID)
      .map(post => post.json())
      .catch(this.handleError);
  }

  GetEventAddressByStoryID(storyID: number): Observable<any> {

    return this._http.get(this._url + '/GetEventAddressByStoryID' + '?storyID=' + storyID)
      .map(post => post.json())
      .catch(this.handleError);
  }

  SubscribeToTopic(storyID): Observable<any> {

    return this._http.get(this._url + '/SubscribeToTopic' + '?userTokens=' + storyID + '&topic=' + storyID)
      .map(post => post.json())
      .catch(this.handleError);
  }

  SendPushMessage(storyID, title, body): Observable<any> {

    return this._http.get(this._url + '/SendPushMessage?storyID=' + storyID + '&title=' + title + '&body=' + body)
      .map(post => post.json())
      .catch(this.handleError);
  }


  public async uploadMedia(uri, options, type, mediaType) {

    let url = BaseLinkProvider.GetBaseUrl() + "/Image?type=" + type;
    if(mediaType == "Video"){
      url = BaseLinkProvider.GetBaseUrl() + "/Video?type=" + type;
    }    

    console.log("Story Service: URL = " + url);
    
    let result = await this.file_transfer.upload(
      encodeURI(uri),
      encodeURI(url),
      options,
      false
    )

    console.log("File Upload Results");
    console.log(result);    
    return result;

  }

  public setCountValue(val){
    this.messagingCount.next(val);    
    sessionStorage.setItem("commentCount", val);
    this.ev.publish("messageCountPublished", val);
  } 
}
