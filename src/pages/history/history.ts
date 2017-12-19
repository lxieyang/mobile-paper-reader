import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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

  ionViewDidLoad() {
    // use the provider
    this.urls_subscription = this.paperDataProvider.historyChanged.subscribe((urls: any[]) => {
      console.log('urls updated @history');
      this.urls = urls;
    });

    // get recent documents
    // this.urls = [];
    // this.storage.get('doc_count').then(count => {
    //   if(count != null) {
    //     for(let i = count; i >= 1; i--) {
    //       this.storage.get('doc_' + i).then(urlObject => {
    //         this.urls.push(urlObject);
    //       });
    //     }
    //   }
    // });
  }

  ionViewWillLeave() {
    // simply don't unsubscribe
    // this.urls_subscription.unsubscribe();
  }

}
