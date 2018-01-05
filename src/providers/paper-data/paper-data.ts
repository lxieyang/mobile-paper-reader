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

  storePaperContent(paper_url: string, paper_content: any) {
    // store the parsed results
    paper_url = paper_url.split("?")[0];  // sanitize paper_url

    this.storage.get('docs').then(docs => {
      if(docs != null) {
        this.storage.get(paper_url).then((newResults) => {
          if(newResults == null) {
            docs.push(paper_url);
            let promise_update_docs = this.storage.set('docs', docs);
            let promise_update_paper_content = this.storage.set(paper_url, paper_content);

            // refresh paper list
            Promise.all([
              promise_update_docs, 
              promise_update_paper_content
            ]).then(() => {
              this.getAllPapersInHistory();
            });
          }
        });                  
      } else {  // first paper
        let promise_update_docs = this.storage.set('docs', [paper_url]);
        let promise_update_paper_content = this.storage.set(paper_url, paper_content);
        
        // refresh paper list
        Promise.all([
          promise_update_docs, 
          promise_update_paper_content
        ]).then(() => {
          this.getAllPapersInHistory();
        });
      }
    }, e => {
      console.log("storage error when trying to get doc_count", e);
    });
  }

  getAllPapersInHistory() {
    let history_urls = [];
    this.storage.get('docs').then(docs => {
      let promises = [];
      if(docs != null && docs.length != 0) {
        for(let i = docs.length - 1; i >= 0; i--) {
          promises.push(this.storage.get(docs[i]).then(paper_content => {
            // {
            //    url: paper_url
            //    title: paper_title
            //  }
            let url_object = {
              url: docs[i],
              title: paper_content['title']
            }
            history_urls.push(JSON.parse(JSON.stringify(url_object)));
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
    this.storage.get('docs').then(docs => {
      if(docs != null) {
        let promises = [];
        for(let i = 0; i < docs.length; i++) {
          promises.push(this.storage.remove(docs[i]));
        }
        promises.push(this.storage.remove('docs'));

        // notify all subscribers
        Promise.all(promises).then(() => {
          this.getAllPapersInHistory();
        });
      }
    });
  }

}
