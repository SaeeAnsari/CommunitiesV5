import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { BaseLinkProvider } from '../../providers/base-link/base-link';


/**
 * Generated class for the LocalGalleryUploadComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'local-gallery-upload',
  templateUrl: 'local-gallery-upload.component.html',
  styleUrls: ['./local-gallery-upload.component.scss'],
  providers: [ImagePicker]
})
export class LocalGalleryUploadComponent implements OnInit {

  ngOnInit(): void {
    if (this.Type == "") {
      this.Type = "Story";
    }

    if (this.UploadedImage != "") {
      this.cloudFileURL = this.UploadedImage;

    }

    console.log("local upload image: " + this.cloudFileURL);

    this.SetImageReplaceParam();
  }




  private SetImageReplaceParam() {
    this.replaceIconWithImage = this.UpdateIconImageOnUpload == "true" && this.cloudFileURL.length > 0;
  }



  @Input() Type: string = "";
  @Input() UpdateIconImageOnUpload: string = "";
  @Input() UploadedImage: string = "";

  @Output() OnFileSaved = new EventEmitter();

  public replaceIconWithImage: boolean = false;
  public cloudFileURL: string = "";


  constructor(
    private imagePicker: ImagePicker
  ) {
    console.log('Hello LocalGalleryUploadComponent Component');

  }

  public imagePickerClick() {

    this.getImages({ maximumImagesCount: 1 }).then(ret => {      
    });
    //this.DummyShowImage();
  }

  public DummyShowImage() {

    var fileName = 'http://res.cloudinary.com/http-communities-me/image/upload/v1504497765/l3ofqjfmzzr8xl5lumiq.jpg';



    this.OnFileSaved.emit({
      mediaType: "Image",
      imageList: [{
        id: -1,
        fileName: fileName,
        publicID: "222",
        versionID: "222"
      }]
    });
  }

  async getImages(options) {
    console.log("Inside the Image Picker");

    this.imagePicker.getPictures(options).then((results) => {

      console.log("Showing Results");

      if (results.length > 0 && results[0] == "O") {
        return;
      }

      for (var i = 0; i < results.length; i++) {

        let uri = results[i];
       
        this.OnFileSaved.emit({
          mediaType: "Image",
          imageList: [{
            id: -1,
            fileName: uri,
            publicID: '',
            versionID: ''
          }]
        });             
      }
    }, (err) => {
      console.log("Image Picker Error: " + JSON.stringify(err));
    })
  } 
}
