import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  api_key: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public platform: Platform,
    public alertCtrl: AlertController
  ) {
    // grad api key
    this.platform.ready().then(() => {
      this.storage.ready().then(() => {
        this.storage.get("api_key").then(key => {
          if(key == null) {
            console.log("No API KEY found!");
          } else {
            this.api_key = key;
            console.log("key: ", key);
          }
        }).catch(err => {
          console.log("storage error");
          console.log(err);
        })
      })

    })
  }

  setApiKey() {
    if (this.api_key != null && this.api_key.length == 32) {
      this.storage.set("api_key", this.api_key);
      let alert = this.alertCtrl.create({
        title: 'Successful!',
        subTitle: 'Your indico API key has been set successfully!',
        buttons: ['OK']
      });
      alert.present();
    } else {
      let alert = this.alertCtrl.create({
        title: 'Oops!',
        subTitle: 'Make sure you have a valid API key!',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  removeApiKey() {
    this.storage.remove("api_key");
    let alert = this.alertCtrl.create({
      title: 'API Key Deleted!',
      subTitle: 'Make sure you set a valid API key before start using this app!',
      buttons: ['OK']
    });
    this.api_key = null;
    alert.present();
  }

}
