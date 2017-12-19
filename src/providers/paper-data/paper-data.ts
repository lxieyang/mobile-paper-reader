import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Storage } from '@ionic/storage';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class PaperDataProvider {

  historyChanged = new ReplaySubject<any[]>();

  constructor(
    public http: Http,
    public storage: Storage
  ) {
    console.log('Hello PaperDataProvider Provider');
    this.init();
  }

  init() {
    this.getAllPapersInHistory();
  }

  getAllPapersInHistory() {
    let history_urls = [];
    this.storage.get('doc_count').then(count => {
      if(count != null) {
        for(let i = count; i >= 1; i--) {
          this.storage.get('doc_' + i).then(urlObject => {
            history_urls.push(JSON.parse(JSON.stringify(urlObject)));
          });
        }
        // notify all subscribers
        this.historyChanged.next(history_urls);
      }
    });
  }

}
