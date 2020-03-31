import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

// -- FONT AWESOME START
import {FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';

import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';



library.add(fas, far, fab);
// -- FONT AWESOME END

import { OpenGraphServiceProvider } from '../app/providers/open-graph-service/open-graph-service';
import { GeoProviderServiceProvider } from '../app/providers/geo-provider-service/geo-provider-service';
import { BaseLinkProvider } from '../app/providers/base-link/base-link';
import { FacebookApiProvider } from '../app/providers/facebook-api/facebook-api';
import { EventProvider } from '../app/providers/event/event';
import { CameraPluginProvider } from '../app/providers/camera-plugin/camera-plugin';
import { HelperProvider } from '../app/providers/helper/helper';
import { ErrorLogServiceProvider } from './providers/error-log-service/error-log-service';
import { TabsPage } from './pages/tabs/tabs.page';

import { CreateTopicComponent } from '../app/components/create-topic/create-topic.component';
import { ForgetPasswordComponent } from '../app/components/forget-password/forget-password.component';
import { LoginComponent } from '../app/components/login-component/login-component.component';

import { NewCommentComponent } from '../app/components/new-comment-component/new-comment-component.component';
import { NewEventComponent } from '../app/components/new-event/new-event.component';
import { RegisterUserComponent } from '../app/components/register-user-component/register-user-component.component';
import { SocialSharingPopoverComponent } from '../app/components/social-sharing-popover/social-sharing-popover.component';
import { UserCommentsComponent } from '../app/components/user-comments-component/user-comments-component.component';

import { ViewTopicsComponent } from '../app/components/view-topics/view-topics.component';

import { UploadedMediaPostComponent } from './components/uploaded-media-post/uploaded-media-post.component';
import { LocalGalleryUploadComponent } from './components/local-gallery-upload/local-gallery-upload.component';
import { VideoUploadComponent } from './components/video-upload/video-upload.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';

import { HttpModule } from '@angular/http';
//import { NativeStorage } from '@ionic-native/native-storage/ngx';
import {IonicStorageModule} from '@ionic/storage';

@NgModule({
  declarations: [
    AppComponent,
    CreateTopicComponent,
    ForgetPasswordComponent,
    LoginComponent,
    
    NewCommentComponent,
    NewEventComponent,
    RegisterUserComponent,
    SocialSharingPopoverComponent,
    UserCommentsComponent,
   
    ViewTopicsComponent,
    UploadedMediaPostComponent,
    LocalGalleryUploadComponent,
    VideoUploadComponent,
    ImageUploadComponent,
  ],
  entryComponents: [
    AppComponent,    
    CreateTopicComponent,
    ForgetPasswordComponent,
    LoginComponent,
    
    NewCommentComponent,
    NewEventComponent,
    RegisterUserComponent,
    SocialSharingPopoverComponent,
    UserCommentsComponent,

    ViewTopicsComponent
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    FormsModule, 
    ReactiveFormsModule, 
    IonicStorageModule.forRoot(),
    FontAwesomeModule,
    HttpModule],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    Deeplinks,
    Geolocation,
    OpenGraphServiceProvider,
    GeoProviderServiceProvider,
    BaseLinkProvider,
    ErrorLogServiceProvider,
    Facebook,
    FacebookApiProvider,
    EventProvider,
    Camera,
    Keyboard,
    MediaCapture,
    FileTransfer,
    File,
    CameraPluginProvider,
    HelperProvider,
    FCM,
    LaunchNavigator,
    //NativeStorage,
    
    AndroidPermissions,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 

  constructor(library: FaIconLibrary) { 
		library.addIconPacks(fas, fab, far);
	}
}
