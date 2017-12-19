import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { SettingsPage } from './../settings/settings';
import { PaperDetailPage } from './../paper-detail/paper-detail';
import { Storage } from '@ionic/storage';
import { Clipboard } from '@ionic-native/clipboard';
import { GetApiTutorialPage } from '../get-api-tutorial/get-api-tutorial';
import { PaperDataProvider } from '../../providers/paper-data/paper-data';
import { Subscription } from 'rxjs/Subscription';
import { UserDataProvider } from '../../providers/user-data/user-data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  paper_url: string;
  api_key: string = null;
  api_key_subscription: Subscription;
  urls: any;
  urls_subscription: Subscription;

  recent_count = 3;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public storage: Storage,
    private clipboard: Clipboard,
    private paperDataProvider: PaperDataProvider,
    private userDataProvider: UserDataProvider
  ) {
  }

  ionViewDidLoad() {
    // update api key
    this.api_key_subscription = this.userDataProvider.apiKeyChanged.subscribe((api_key: string) => {
      this.api_key = api_key;
    });

    // use paperDataService to get all papers
    this.urls_subscription = this.paperDataProvider.historyChanged.subscribe((urls: any[]) => {
      console.log('urls updated @home');
      this.urls = urls;
    });
  }

  ionViewWillLeave() {
    // simply don't unsubscribe
    // this.urls_subscription.unsubscribe();
    // this.api_key_subscription.unsubscribe();
  }

  selectPaperUrl(url) {
    this.readThisPaper(url, this.api_key, true);
  }

  goToPaperDetail(is_from_storage) {
    this.readThisPaper(this.paper_url, this.api_key, is_from_storage);
  }

  readThisPaper(paper_url: string, api_key: string, is_from_storage: boolean) {
    this.navCtrl.push(PaperDetailPage, {
      paper_url,
      api_key,
      is_from_storage
    });
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
    if (this.api_key != null) {
      // go to view the paper
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
  }

  goToTutorialPage() {
    this.navCtrl.push(GetApiTutorialPage);
  }

}
