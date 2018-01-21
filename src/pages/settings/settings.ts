import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { GetApiTutorialPage } from './../get-api-tutorial/get-api-tutorial';
import { AboutPage } from '../about/about';
import { PaperDataProvider } from '../../providers/paper-data/paper-data';
import { UserDataProvider } from '../../providers/user-data/user-data';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  api_key: string = null;

  app_version;

  // reading
  font_size: number;
  background_choice: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public platform: Platform,
    public alertCtrl: AlertController,
    private iab: InAppBrowser,
    private paperDataProvider: PaperDataProvider,
    private userDataProvider: UserDataProvider
  ) {
  }

  ionViewDidLoad() {
    this.userDataProvider.apiKeyChanged.subscribe(api_key => this.api_key = api_key);
    this.userDataProvider.fontSizeChanged.subscribe(font_size => this.font_size = font_size);
    this.userDataProvider.backgroundChoiceChanged.subscribe(bg_choice => this.background_choice = bg_choice);
    this.app_version = this.userDataProvider.getAppVersion();
  }

  setApiKey() {
    if (this.api_key != null && this.api_key.length == 32) {
      this.userDataProvider.setAPI(this.api_key);
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
    this.userDataProvider.removeAPI();
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

  changeBackgroundTo(background_choice: string) {
    this.background_choice = background_choice;
    this.userDataProvider.setBackgroundChoice(background_choice);
  }

  setFontSize() {
    this.userDataProvider.setFontSize(this.font_size);
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
            this.paperDataProvider.clearAllPapersInHistory();
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
