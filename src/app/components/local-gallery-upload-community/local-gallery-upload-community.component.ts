import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

//import { ImagePicker } from '@ionic-native/image-picker';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';

import { BaseLinkProvider } from '../../providers/base-link/base-link';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-local-gallery-upload-community',
  templateUrl: './local-gallery-upload-community.component.html',
  styleUrls: ['./local-gallery-upload-community.component.scss'],
})


export class LocalGalleryUploadCommunityComponent implements OnInit {

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


  private file_transfer: FileTransferObject = this.transfer.create();


  @Input() Type: string = "";
  @Input() UpdateIconImageOnUpload: string = "";
  @Input() UploadedImage: string = "";

  @Output() OnFileSaved = new EventEmitter();

  public replaceIconWithImage: boolean = false;
  public cloudFileURL: string = "";


  constructor(
    //private imagePicker: ImagePicker,
    private transfer: FileTransfer,
    private file: File,
    public loadingCtrl: LoadingController
  ) {
    console.log('Hello LocalGalleryUploadComponent Component');

  }

  public imagePickerClick() {

    //this.getImages({ maximumImagesCount: 1 });
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
}

