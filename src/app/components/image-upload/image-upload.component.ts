import { Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import { CameraPluginProvider } from '../../providers/camera-plugin/camera-plugin';

/**
 * Generated class for the ImageUploadComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'image-upload',
  templateUrl: 'image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  providers: [CameraPluginProvider]
})
export class ImageUploadComponent implements OnInit {
  

  public mediaType: string = "";
  public cloudFileURL: string = "";
  public replaceIconWithImage: boolean = false;

  @Input() UpdateIconImageOnUpload: string="";
  @Input() ImageCategory: string;

  @Output() OnFileSaved = new EventEmitter();  

  constructor(    
    private cameraPluginServices: CameraPluginProvider    
  ) {
  }


  ngOnInit(): void {
      this.SetImageReplaceParam();
  }

    private SetImageReplaceParam() {
        this.replaceIconWithImage = this.UpdateIconImageOnUpload == "true" && this.cloudFileURL.length > 0;
    }

  public async launchCamera() {

    
    try {

      let orignal = await this.cameraPluginServices.open_camera();
      console.log(orignal);
      //this.DummyShowImage();
      this.upload(orignal);
    }
    catch (e) {
      console.log("Error : " + e);
    }
  }

  //Dummy Image for testing
  public DummyShowImage() {

    var fileName = 'http://res.cloudinary.com/http-communities-me/image/upload/v1504497765/l3ofqjfmzzr8xl5lumiq.jpg';
    this.mediaType = "Image";


    this.cloudFileURL = fileName;
    this.SetImageReplaceParam();

    this.OnFileSaved.emit({
      mediaType: "Image",
      imageList: [{
        id:-1,
        fileName: fileName,
        publicID: "222",
        versionID :"222"
      }]         
    });
  }


  public async upload(cameraImageURL) {   

    this.OnFileSaved.emit({
      mediaType: "Image",
      imageList: [{
        id:-1,
        fileName: cameraImageURL,
        publicID: -1,
        versionID :-1
      }]         
    });

   
    try {
      




    } catch (e) {
      console.log("Error : " + JSON.stringify(e));

    }
  }
}
