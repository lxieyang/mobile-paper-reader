import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from './../settings/settings';

@Component({
  selector: 'page-get-api-tutorial',
  templateUrl: 'get-api-tutorial.html',
})
export class GetApiTutorialPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
  }

  goToSettingsPage() {
    this.navCtrl.push(SettingsPage);
  }

}
