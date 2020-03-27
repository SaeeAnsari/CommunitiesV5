import { Component, OnInit } from '@angular/core';
import {  NavController, ModalController, Platform, LoadingController } from '@ionic/angular';
//import { NativeStorage } from '@ionic-native/native-storage/ngx';
import {Storage} from '@ionic/storage';
import { TabsPage } from '../tabs/tabs.page';
import { LoginComponent } from '../../components/login-component/login-component.component';
import { RegisterUserComponent } from '../../components/register-user-component/register-user-component.component';
import { UserLocationPage } from '../user-location/user-location.page';
import { UserService } from '../../providers/user-service';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { ErrorLogServiceProvider } from '../../providers/error-log-service/error-log-service';

//import { User } from '../../interfaces/User';


import { ForgetPasswordComponent } from '../../components/forget-password/forget-password.component';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [UserService, Facebook, ErrorLogServiceProvider]
})
export class LoginPage {
  


  private userLoaded: boolean = false; //Hack to make sure we only load the user once

  constructor(
    private storage: Storage,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private _userService: UserService,
    private fb: Facebook,
    private err: ErrorLogServiceProvider,
    private platform: Platform,
    private firebaseIonic: FCM,
    private googlePlus: GooglePlus,
    public loadingCtrl: LoadingController,
    private androidPermissions: AndroidPermissions,
    private router: Router
  ) {
    //this.onNotification();

  }
  /*
    async onNotification() {
      try {
  
       
        await this.platform.ready();   
  
        this.firebaseIonic.onNotificationOpen().subscribe(sub => {
          console.log("Notification Opened");
          console.log(sub);
        });
      }
      catch (e) {
        console.log('erroring');
        console.log(e)
      }
    }
    */

  async facebookLogin() {

    let loading = await this.loadingCtrl.create({
      message: 'Connecting to Facebook...',
      spinner: 'dots'
    });

    loading.present();
    this.err.logError('Login FB Clicked').subscribe();

    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res: FacebookLoginResponse) => {
        let userID = "0";

        if (res != null) {
          userID = res.authResponse.userID;
          console.log('userID found ', JSON.stringify(res));

          loading.dismiss();
          this.getFacebookUserDetails(userID, res);
        }
      })
      .catch(e => {       
        loading.message = "Facebook Authentication Failed";
        loading.present();

        setTimeout(() => {
          loading.dismiss();
        }, 5000);

        console.log('Login FB Failed + ' + JSON.stringify(e));
        this.err.logError('Login FB Failed + ' + JSON.stringify(e)).subscribe()
      });

    this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
  }

  async getFacebookUserDetails(userID: string, res: any) {

     
    let loading = await this.loadingCtrl.create({
      message: 'Signing on ...',
      spinner: 'dots'
    });
    loading.present();
    
    this.fb.api('/' + userID + '?fields=id,name,email,first_name,last_name,picture,gender', []).then(data => {
      console.log(data);

      this._userService.AuthenticateThirdPartyUser(data.id).subscribe(sub => {
        console.log("RAW got : " + sub)
        if (sub != null && +sub > 0) {
          console.log("Found the User : " + sub);          
          this.ionViewDidLoad(sub);
        }
        else {
          var user = {
            id: -1,
            firstName: data.first_name,
            lastName: data.last_name,
            gender: data.gender == "male" ? "M" : "F",
            email: data.email,
            imageURL: data.picture.data.url,
            thirdPartyAuthID: data.id,
            authenticationPortalID: 2,
            active: true
          }

          console.log(user);

          this._userService.RegisterSocialAuthUser(user).subscribe(sub => {
            console.log("loaded :" + sub);            
            this.ionViewDidLoad(sub);
          });
        }
        loading.dismiss();
      })

    });
  }

  doDummyLogin() {
    var user = {
      id: -1,
      firstName: "Saeed",
      lastName: "Ansari",
      gender: "male" == "male" ? "M" : "F",
      email: "saedansari@gmail.com",
      imageURL: "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/10525797_10152962537591528_3712779174895063807_n.jpg?oh=d0cab2c3e0a6b4d80de9df1369f917ba&oe=59F7E379",
      thirdPartyAuthID: "10155483413286528",
      authenticationPortalID: 2,
      active: true
    }

    console.log(user);

    this._userService.AuthenticateThirdPartyUser(user.thirdPartyAuthID).subscribe(sub => {
      console.log("RAW got : " + sub)
      if (sub != null && +sub > 0) {
        console.log("Found the User : " + sub);        
        this.ionViewDidLoad(sub);
      }
      else {
        var user2 = {
          id: -1,
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender == "male" ? "M" : "F",
          email: user.email,
          imageURL: user.imageURL,
          thirdPartyAuthID: user.thirdPartyAuthID,
          authenticationPortalID: 2,
          active: true
        }

        console.log(user2);

        this._userService.RegisterSocialAuthUser(user2).subscribe(sub => {
          console.log("loaded :" + sub);          
          this.ionViewDidLoad(sub);
        });
      }
    })

  }

  async loadForgetPasswordModal() {

    let forgetPasswordModal = await this.modalCtrl.create({
      component: ForgetPasswordComponent
    });
    //let forgetPasswordModal = await this.modalCtrl.create(ForgetPasswordComponent, null, { showBackdrop: true, enableBackdropDismiss: true });
    forgetPasswordModal.present();
  }

  async loginClicked() {

    let loginRegisterModal = await this.modalCtrl.create({
      component: LoginComponent
    });
    //let loginRegisterModal = this.modalCtrl.create(LoginComponent, null, { showBackdrop: true, enableBackdropDismiss: true });

    loginRegisterModal.onDidDismiss().then(data => {

      console.log("Registration Data Object: " + JSON.stringify(data));

      if (data) {

        if (data.data.isRegistering) {
          this.loadRegistrationModal();
        }
        else if (data.data.forgetPassword) {
          this.loadForgetPasswordModal();
        }
      }
    });
    return await loginRegisterModal.present();
  }

  async loadRegistrationModal() {
    //let registerModal = this.modalCtrl.create(RegisterUserComponent, null, { showBackdrop: true, enableBackdropDismiss: true });
    let registerModal = await this.modalCtrl.create({
      component: RegisterUserComponent
    });
    registerModal.onDidDismiss().then(data => {

      if (data.data) {
        if (data.data.id) {
          
          this.navCtrl.navigateForward("/user-location/" + data.data.id)
          
          //this.navCtrl.push(UserLocation, data);

        }
      }
    });
    registerModal.present();
  }

  ionViewDidLoad(userID: number) {
    console.log("User Loaded: " + this.userLoaded);
    if (!this.userLoaded) {
      console.log("Loading User");      
      if (userID > 0){
        console.log("selected UserID from Storage");
        console.log("User ID: " + userID);
        sessionStorage.setItem("userID", userID.toString());//Temporary removeit later
        console.log("Saved User to Session");
        this._userService.getLoggedinInUser().subscribe(s => {
          if (s != null && s.ID > 0) {
            console.log("Got The Logged in User: " + JSON.stringify(s));
            this.err.logError("Login: Clearing the server: got something from server");

            if (s.DefaultCommunityID <= 0) {
              this.err.logError("Login: No default Location found, we neeed the user to sett the location");
              //this.navCtrl.push(UserLocation);
              
              this.navCtrl.navigateForward("/tabs/tab1");
            }
            else {              
              this.userLoaded = true;             
              this.navCtrl.navigateForward("/tabs/tab1/");           
            }
          }
        });
      }
        console.log('ionViewDidLoad Login');
    }

    /*this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
    );*/
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]);
    
  }



  async googleLogin2(){
    console.log("Google Login 2");
  }


  async googleLogin() {
    console.log("Google Auth");

    let loading = await this.loadingCtrl.create({
      message: 'Connecting to Google...',
      spinner: 'dots'
    });

    loading.present();

    console.log("starting google login process");

    this.googlePlus.login({})
      .then(res => {
        console.log("Google Authentication");

        let _googleID = res.userId;
        let name = res.displayName;
        let email = res.email;
        let photo = res.imageUrl;

        let firstname = res.givenName;
        let lastName = res.familyName;

        loading.message = "Signing on ...";

        console.log("About to Call AthenticateThirdPartyUser");

        this._userService.AuthenticateThirdPartyUser(_googleID).subscribe(sub => {
          console.log("RAW got : " + sub);

          if (sub != null && +sub > 0) {
            console.log("Found the User : " + sub);            
            this.ionViewDidLoad(sub);
          }
          else {

            var user = {
              id: -1,
              firstName: firstname,
              lastName: lastName,
              gender: null,
              email: email,
              imageURL: photo,
              thirdPartyAuthID: _googleID,
              authenticationPortalID: 3,
              active: true
            }

            console.log(user);

            this._userService.RegisterSocialAuthUser(user).subscribe(sub => {
              console.log("loaded :" + sub);              
              loading.dismiss();
              this.ionViewDidLoad(sub);
            });
          }
        });
        loading.dismiss();
      })
      .catch(err => {
        console.error(err);
        
        loading.message = "Google login failed";
        loading.present();
        
        setTimeout(() => {
          loading.dismiss();
        }, 5000);        
      });
  }
}
