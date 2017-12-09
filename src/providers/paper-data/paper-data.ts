import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Storage } from '@ionic/storage';

@Injectable()
export class PaperDataProvider {

  history_urls: any;

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
    this.storage.get('doc_count').then(count => {
      if(count != null) {
        for(let i = count; i >= 1; i--) {
          this.storage.get('doc_' + i).then(urlObject => {
            this.history_urls.push(urlObject);
          });
        }
      }
    });
  }

  getHistory(count: number) {   // if count == 0, return all
    if (count) {
      return this.history_urls.slice(0, count);
    } else {
      return this.history_urls;
    }
  }



}
