import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { GetApiTutorialPage } from './../get-api-tutorial/get-api-tutorial';
import { AboutPage } from '../about/about';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  api_key: string;

  // reading
  font_size: number;
  background_choice: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public platform: Platform,
    public alertCtrl: AlertController,
    private iab: InAppBrowser
  ) {
    // grad api key
    this.platform.ready().then(() => {
      this.storage.ready().then(() => {

        // retrieve api key
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
        });

        // retrieve background color
        this.storage.get('bg_choice').then(bg_choice => {
          if (bg_choice) {
            this.background_choice = bg_choice;
          } 
        })

        // retrieve font size
        this.storage.get('font_size').then(font_size => {
          if (font_size) {
            this.font_size = font_size;
          } 
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

  goToTutorialPage() {
    this.navCtrl.push(GetApiTutorialPage);
  }

  goToAboutPage() {
    this.navCtrl.push(AboutPage);
  }

  openInAppBrowser(url) {
    this.iab.create(url);
  }

  backgroundChangeToBlack() {
    this.background_choice = "black";
    this.storage.set('bg_choice', 'black');
  }

  backgroundChangeToWhite() {
    this.background_choice = "white";
    this.storage.set('bg_choice', 'white');
  }

  backgroundChangeToLightYellow() {
    this.background_choice = "light-yellow";
    this.storage.set('bg_choice', 'light-yellow');
  }

  setFontSize() {
    // console.log("Change font size: " + this.font_size);
    this.storage.set('font_size', this.font_size);
  }

  clearHistory() {
    let alert = this.alertCtrl.create({
      title: 'Are you sure you want to clear the history?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Go ahead!',
          handler: data => {
            this.storage.get('doc_count').then(count => {
              if(count != null) {
                this.storage.remove('doc_count');
                for(let i = count; i >= 1; i--) {
                  this.storage.remove('doc_' + i);
                }
              }
            });
            let alert2 = this.alertCtrl.create({
              title: 'History cleared!',
              buttons: ['Got it']
            })
            alert2.present();
          }
        }
      ]
    });
    alert.present();
  }

}
