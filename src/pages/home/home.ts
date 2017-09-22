import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { SettingsPage } from './../settings/settings';
import { PaperDetailPage } from './../paper-detail/paper-detail';
import { Storage } from '@ionic/storage';
import { Clipboard } from '@ionic-native/clipboard';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  paper_url: string;
  api_key: string;

  // font_size: number = 15;
  // background_choice = "white";

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public storage: Storage,
    private clipboard: Clipboard
  ) {
  }

  // increaseFontSize() {
  //   if(this.font_size <= 19) {
  //     this.font_size = this.font_size + 1;
  //   }
  // }

  // decreaseFontSize() {
  //   if(this.font_size >= 11) {
  //     this.font_size = this.font_size - 1;
  //   }
  // }

  // backgroundChangeToBlack() {
  //   this.background_choice = "black";
  // }

  // backgroundChangeToWhite() {
  //   this.background_choice = "white";
  // }

  // backgroundChangeToLightYellow() {
  //   this.background_choice = "light-yellow";
  // }

  // currently unused
  pasteFromClipboard() {
    this.clipboard.paste().then(
      (resolve: string) => {
         console.log(resolve);
         this.paper_url = resolve;
         let alert = this.alertCtrl.create({
            title: 'Copied!',
            buttons: ['Ok']
          });
          alert.present();
       },
       (reject: string) => {
          console.log(reject);
          let alert = this.alertCtrl.create({
            title: 'Oops!',
            subTitle: 'Your clipboard seems EMPTY!',
            buttons: ['Got it!']
          });
          alert.present();
       }
     );
  }

  checkApiAndGoToPaperDetail() {
    this.storage.ready().then(() => {
      this.storage.get('api_key').then(key => {
        if (key != null) {
          // go to view the paper
          this.api_key = key;
          if (this.paper_url) {
            this.navCtrl.push(PaperDetailPage, {
              paper_url : this.paper_url,
              api_key: this.api_key
            });
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

}
