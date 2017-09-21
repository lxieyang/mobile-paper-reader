import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PaperDetailPage } from './../paper-detail/paper-detail';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  paper_url: string;

  constructor(public navCtrl: NavController) {
    
  }

  goToPaperDetailPage() {
    this.navCtrl.push(PaperDetailPage, {
      paper_url : this.paper_url
    });
  }

}
