import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { UserDataProvider } from '../../providers/user-data/user-data';

@Injectable()
export class PaperDataProvider {

  storage_directory: any;

  historyChanged = new ReplaySubject<any[]>();

  constructor(
    public http: Http,
    public storage: Storage,
    public file: File,
    private userDataProvider: UserDataProvider
  ) {
    console.log('Hello PaperDataProvider Provider');
    this.init();
  }

  init() {
    this.userDataProvider.storageLocationChanged.subscribe(storage_location => this.storage_directory = storage_location);
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

  deleteThisPaperFromHistory(paper_url: string) {
    // remove from 'docs' array
    this.storage.get('docs').then(docs => {
      docs.splice(docs.indexOf(paper_url), 1);  // remove it from the array
      if (docs.length == 0) {
        this.storage.remove('docs').then(() => {
          this.getAllPapersInHistory();
        });
      } else {
        this.storage.set('docs', docs).then(() => {
          this.getAllPapersInHistory();
        });
      }
    });

    // remove actual pdf file
    this.storage.get(paper_url).then((paper_content) => {
      this.file.removeFile(this.storage_directory, paper_content['filename'])
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });

      // remove record
      this.storage.remove(paper_url);
    });
    
  }
  
  clearAllPapersInHistory() {
    this.storage.get('docs').then(docs => {
      if(docs != null) {
        let promises = [];
        for(let i = 0; i < docs.length; i++) {
          this.storage.get(docs[i]).then((paper_content) => {
            this.file.removeFile(this.storage_directory, paper_content['filename'])
            .then((result) => {
              console.log(result);
            })
            .catch((err) => {
              console.log(err);
            });
          });
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
