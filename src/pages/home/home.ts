import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { SettingsPage } from './../settings/settings';
import { PaperDetailPage } from './../paper-detail/paper-detail';
import { Storage } from '@ionic/storage';
import { Clipboard } from '@ionic-native/clipboard';
import { GetApiTutorialPage } from '../get-api-tutorial/get-api-tutorial';
import { PaperDataProvider } from '../../providers/paper-data/paper-data';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  paper_url: string;
  api_key: string = null;
  urls: any;
  urls_subscription: Subscription;

  recent_count = 3;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public storage: Storage,
    private clipboard: Clipboard,
    private paperDataProvider: PaperDataProvider
  ) {
    this.getAPI();
  }

  getAPI() {
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

  goToPaperDetail(is_frome_storage) {
    this.navCtrl.push(PaperDetailPage, {
      paper_url : this.paper_url,
      api_key: this.api_key,
      is_from_storage: is_frome_storage
    });
  }

  ionViewDidLoad() {
    this.getAPI();

    // use paperDataService to get all papers
    this.urls_subscription = this.paperDataProvider.historyChanged.subscribe((urls: any[]) => {
      console.log('urls updated @home');
      this.urls = urls;
      console.log(this.urls);
    });

    // get recent documents
    // this.urls = [];
    // this.storage.get('doc_count').then(count => {
    //   if(count != null) {
    //     for(let i = count; i >= 1; i--) {
    //       if(count - i >= this.recent_count) {
    //         break;
    //       }
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

  // currently unused
  pasteFromClipboard() {
    this.clipboard.paste().then(
      (resolve: string) => {
        console.log(resolve);
        this.paper_url = resolve;
        if (!resolve) {
          throw new Error('Clipboard empty');
        }
        // let alert = this.alertCtrl.create({
        //   title: 'Copied!',
        //   buttons: ['Ok']
        // });
        // alert.present();
      }).catch((err) => {
      console.log(err);
      let alert = this.alertCtrl.create({
        title: 'Oops!',
        subTitle: 'Something went wrong! Could be your clip board\'s empty',
        buttons: ['Got it!']
      });
      alert.present();
      });
  }

  clearInputBox() {
    this.paper_url = "";
  }

  checkApiAndGoToPaperDetail() {
    this.storage.ready().then(() => {
      this.storage.get('api_key').then(key => {
        if (key != null) {
          // go to view the paper
          this.api_key = key;
          if (this.paper_url) {
            this.goToPaperDetail(false);
          }
          
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

  goToTutorialPage() {
    this.navCtrl.push(GetApiTutorialPage);
  }

}
