import { Injectable } from '@angular/core';
import { ModalController, NavParams, NavController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserMessageService {

  constructor(public toast:ToastController) { }

  async presentToast(message: string) {
    
    let toast = await this.toast.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss().then(() => {
      console.log('Dismissed toast');
    });

    await toast.present();
  }
}
