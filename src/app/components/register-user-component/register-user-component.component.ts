import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { NavController, NavParams, ModalController, LoadingController } from '@ionic/angular';
//import { NativeStorage } from '@ionic-native/native-storage';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Rx';
import { UserService } from '../../providers/user-service';

import { MediaPostService } from '../../providers/media-post-service';
import { StoryService } from '../../providers/story-service';

/**
 * Generated class for the RegisterUserComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'register-user-component',
  templateUrl: 'register-user-component.component.html',
  styleUrls: ['./register-user-component.component.scss'],
  providers: [UserService, MediaPostService, StoryService]
})
export class RegisterUserComponent {

  public registerationForm: FormGroup;
  private id: number;
  private isUploadingImage: boolean = false;
  private uploaded: boolean = false;
  private selfieURL: string = "";
  public passwordMatch: boolean = true;


  constructor(private _fb: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    private _userService: UserService,
    private _mediaPost: MediaPostService,
    public vc: ModalController,
    private storage: Storage,
    private storyService: StoryService,
    public loadingController: LoadingController) {
    this.registerationForm = this._fb.group({
      firstName: ['', [<any>Validators.required, <any>Validators.minLength(2)]],
      lastName: ['', [<any>Validators.required, <any>Validators.minLength(2)]],
      email: ['', [<any>Validators.required]],
      password: ['', [<any>Validators.required, <any>Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, <any>Validators.minLength(6)]]
    });

    //Test variable
    //this.selfieURL = "https://res.cloudinary.com/http-communities-me/image/upload/v1587493414/vweie6ybfixsgxu6agjb.jpg";

    
  }

  fileChange(event) {

    this.isUploadingImage = true;

    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);


      this._mediaPost.postImage(formData, 'User').subscribe(sub => {
        this.uploaded = true;
        this.isUploadingImage = false;

        this.selfieURL = sub;
      });
    }
  }

  async saveUser(model, isValid: boolean) {

    this.passwordMatch = model.password == model.confirmPassword;

    if (isValid && isValid == true) {
      if (this.passwordMatch) {
        if (this.selfieURL != "") {
          model.imageURL = this.selfieURL;
        }


        model.authenticationPortalID = 1;//Custom
        this._userService.RegisterUser(model).subscribe(sub => {
          this.id = +sub;
          this.storage.set("userID", this.id);
          sessionStorage.setItem('userID', this.id.toString());
          let data = {
            id: this.id
          };
          
          this.vc.dismiss(data);
        });
      }
    }
  }


  async mediaSelectedForPosting(data) {

    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 90000
    });

    console.log("inside the imageSelectedForPosting");
    if (data != null) {
      console.log("Got Data: " + JSON.stringify(data));

      if (data.mediaType == "Image") {

        data.imageList.forEach(element => {


          let options = {
            fileKey: 'file',
            fileName: element.fileName,
            mimeType: 'image/jpeg',
            chunkedMode: false,
            headers: {
              'Content-Type': undefined
            },
            params: {}
          };

          loading.present();

          var results = this.storyService.uploadMedia(element.fileName, options, "User", "Image");
          console.log("New Comment: Uploaded Result " + results);

          results.then(result => {
            console.log("Return variable");
            console.log(result);

            var parsingString = result.response;
            var fileName = parsingString.substring(parsingString.indexOf("<FileName>"), parsingString.indexOf("</FileName>")).replace("<FileName>", "");
            var publicID = parsingString.substring(parsingString.indexOf("<PublicID>"), parsingString.indexOf("</PublicID>")).replace("<PublicID>", "");
            var versionID = parsingString.substring(parsingString.indexOf("<VersionID>"), parsingString.indexOf("</VersionID>")).replace("<VersionID>", "")

            this.selfieURL = fileName;
            console.log(this.selfieURL);

            console.log("Register User Upload : Filename " + fileName);
            console.log(fileName);

            loading.dismiss();            
          })                  
        });
      }
    }
  }



  closeModal() {
    this.vc.dismiss();
  }

}
