import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { UserDataProvider } from '../../providers/user-data/user-data';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  app_version;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private iab: InAppBrowser,
    private userDataProvider: UserDataProvider
  ) {
  }

  ionViewDidLoad() {
    this.app_version = this.userDataProvider.getAppVersion();
  }

  openInAppBrowser(url) {
    this.iab.create(url);
  }

}
