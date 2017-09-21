import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { SettingsPage } from './../settings/settings';
import { PaperDetailPage } from './../paper-detail/paper-detail';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  paper_url: string;
  api_key: string;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public storage: Storage
  ) {
  }

  checkApiAndGoToPaperDetail() {
    this.storage.ready().then(() => {
      this.storage.get('api_key').then(key => {
        if (key != null) {
          // go to view the paper
          this.api_key = key;
          this.navCtrl.push(PaperDetailPage, {
            paper_url : this.paper_url,
            api_key: this.api_key
          });
        } else {
          let alert = this.alertCtrl.create({
            title: 'API Key Missing!',
            subTitle: 'Please go to the settings page to set your API key.',
            buttons: [
              {
                text: 'Cancel',
                handler: data => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Ok, go now!',
                handler: data => {
                  this.navCtrl.push(SettingsPage);
                  console.log('Ok clicked');
                }
              }
            ]
          });
          alert.present();
        }
      })
    });
  }

}
