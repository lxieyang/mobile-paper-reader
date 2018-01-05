import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ItemSliding } from 'ionic-angular';

import { PaperDetailPage } from './../paper-detail/paper-detail';

import { Storage } from '@ionic/storage';
import { PaperDataProvider } from '../../providers/paper-data/paper-data';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  paper_url: string;
  api_key: string = null;
  urls: any;
  urls_subscription: Subscription;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public storage: Storage,
    private paperDataProvider: PaperDataProvider
  ) {
    this.storage.ready().then(() => {
      // get API key
      this.storage.get('api_key').then(key => {
        if (key != null && key.length == 32) {
          // valid key
          this.api_key = key;
        }
      });

    });
  }

  selectPaperUrl(url) {
    this.navCtrl.push(PaperDetailPage, {
      paper_url : url,
      api_key: this.api_key,
      is_from_storage: true
    });
  }

  deletePaper(url, slidingItem: ItemSliding) {
    let alert = this.alertCtrl.create({
      title: 'Please confirm:',
      subTitle: 'Are you sure you want to delete this document from history?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            slidingItem.close();
          }
        },
        {
          text: 'Yes, delete it!',
          handler: data => {
            this.paperDataProvider.deleteThisPaperFromHistory(url);
          }
        }
      ]
    });
    alert.present();
  }

  ionViewDidLoad() {
    // use the provider
    this.urls_subscription = this.paperDataProvider.historyChanged.subscribe((urls: any[]) => {
      console.log('urls updated @history');
      this.urls = urls;
    });
  }

  ionViewWillLeave() {
    // simply don't unsubscribe
    // this.urls_subscription.unsubscribe();
  }

}
