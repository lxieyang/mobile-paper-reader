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

  storePaperContent(paper_url: string, paper_title: string, paper_content: any) {
    // store the parsed results
    this.storage.get('doc_count').then(count => {
      if(count != null) {
        this.storage.get(paper_url.split("?")[0]).then((newResults) => {
          if(newResults == null) {
            let p1 = this.storage.set('doc_count', ++count);
            let p2 = this.storage.set('doc_' + count, {
              url: paper_url.split("?")[0], 
              title: paper_title
            });
            let p3 = this.storage.set(paper_url.split("?")[0], paper_content); 

            // refresh paper list
            Promise.all([p1, p2, p3]).then(() => {
              this.getAllPapersInHistory();
            });
          }
        });                  
      } else {  // first paper
        count = 1;
        let p1 = this.storage.set('doc_count', count);
        let p2 = this.storage.set('doc_' + count, {
          url: paper_url.split("?")[0], 
          title: paper_title
        });
        let p3 = this.storage.set(paper_url.split("?")[0], paper_content);

        // refresh paper list
        Promise.all([p1, p2, p3]).then(() => {
          this.getAllPapersInHistory();
        });
      }
    }, e => {
      console.log("storage error when trying to get doc_count", e);
    });
  }

  getAllPapersInHistory() {
    let history_urls = [];
    this.storage.get('doc_count').then(count => {
      let promises = [];
      if(count != null) {
        for(let i = count; i >= 1; i--) {
          promises.push(this.storage.get('doc_' + i).then(urlObject => {
            history_urls.push(JSON.parse(JSON.stringify(urlObject)));
            return Promise.resolve;
          }));
        }
      }
      // notify all subscribers
      Promise.all(promises).then(() => {
        this.historyChanged.next(history_urls);
      });
    });
  }

  clearAllPapersInHistory() {
    this.storage.get('doc_count').then(count => {
      if(count != null) {
        let promises = [];
        promises.push(this.storage.remove('doc_count'));
        for(let i = count; i >= 1; i--) {
          this.storage.get('doc_' + i).then((result) => {
            promises.push(this.storage.remove(result.url));
          })
          promises.push(this.storage.remove('doc_' + i));
        }
        // notify all subscribers
        Promise.all(promises).then(() => {
          this.getAllPapersInHistory();
        });
      }
    });
  }

}
