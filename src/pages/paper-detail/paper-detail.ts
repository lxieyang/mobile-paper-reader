import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-paper-detail',
  templateUrl: 'paper-detail.html',
})
export class PaperDetailPage {
  
  paper_url: string = "";
  paper_text: string = "";
  is_from_storage: boolean;
  paper_metadata: any;

  pdf_extraction_api_endpoint: string = "https://apiv2.indico.io/pdfextraction";
  api_key: string;

  error_msg: any = "";

  storage_directory: any;
  filename: string = "paper-to-read.pdf"
  dataURL: string;
  pdf_prefix = "data:application/pdf;base64,";

  // visual effect
  font_size: number;
  background_choice: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public http: Http,
    public platform: Platform,
    public file: File,
    public storage: Storage,
    public transfer: FileTransfer
  ) {
    this.platform.ready().then(() => {
      if(this.platform.is('android')) {
        this.storage_directory = this.file.externalDataDirectory;
      } else {  // ios
        this.storage_directory = this.file.dataDirectory;
      }

      this.storage.ready().then(() => {
        this.storage.get('font_size').then(font_size => {
          this.font_size = font_size;
        });
        this.storage.get('bg_choice').then(bg_choice => {
          this.background_choice = bg_choice;
        });
      });

      console.log("file stored at: " + this.storage_directory);

      this.paper_url = this.navParams.get("paper_url");
      this.api_key = this.navParams.get("api_key");
      this.is_from_storage = this.navParams.get("is_from_storage");
      this.pdfExtraction();  
    });
    
  }

  pdfExtraction() {
    let loader = this.loadingCtrl.create({
      content: "Please wait for your paper to be parsed..."
    });
    loader.present();

    // in storage
    if(this.is_from_storage) {
      this.storage.get(this.paper_url).then(results => {
        loader.dismiss();
        this.paper_text = results.text;
      }).catch(err => {
        loader.dismiss();
        this.error_msg = "Storage error! | " + err;
      });
      return;
    }

    // new document
    // download pdf to local file system
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(this.paper_url, this.storage_directory + '/' + this.filename).then((entry) => {
      // download complete
      console.log('download complete: ' + entry.toURL());

      // base64 encode the pdf
      this.file.readAsDataURL(this.storage_directory, this.filename).then(dataURL => {
        console.log(dataURL);
        this.dataURL = dataURL;

        if (!dataURL.startsWith(this.pdf_prefix)) {
          // not pdf file
          loader.dismiss();
          this.error_msg = "Invalid PDF file!";
        } else {
          // remove prefix and send request
          this.dataURL = dataURL.replace(this.pdf_prefix, "");
          let body = {
            api_key: this.api_key,
            data: this.dataURL,
            text: true,
            images: true,
            tables: true,
            metadata: true
          }
          this.http.post(this.pdf_extraction_api_endpoint, JSON.stringify(body))
            .map(res => res.json())
            .subscribe(databack => {
              // successfully got the databack
              loader.dismiss();
              let results = databack.results;
              
              // console.log(databack.results.images);

              // present the texts
              this.paper_text = results.text;

              // store the parsed results
              this.storage.get('doc_count').then(count => {
                if(count != null) {
                  this.storage.get(this.paper_url.split("?")[0]).then((newResults) => {
                    if(newResults == null) {
                      this.storage.set('doc_count', ++count);
                      this.storage.set('doc_' + count, this.paper_url.split("?")[0]);
                      this.storage.set(this.paper_url.split("?")[0], results);
                    }
                  });                  
                } else {
                  count = 1;
                  this.storage.set('doc_count', count);
                  this.storage.set('doc_' + count, this.paper_url.split("?")[0]);
                  this.storage.set(this.paper_url.split("?")[0], results);
                }
              })
            }, err => {
              loader.dismiss();
              console.log(err);
              console.log(JSON.parse(err._body).error);
              this.error_msg = JSON.parse(err._body).error;
            });
        }

      }).catch(e => {
        loader.dismiss();
        console.log("encode base64 failed");
        this.error_msg = "Cannot read file!"
        console.log(e);
      });

    }, (error) => {
      // handle error
      loader.dismiss();
      console.log("Download error: ");
      this.error_msg = "Invalid paper url!"
      console.log(error);
    });
    
  }

  ionViewWillLeave() {
    // remove the file when leaving
    if(!this.is_from_storage) {
      this.file.removeFile(this.storage_directory, this.filename);
    }
  }

  // not permanent
  increaseFontSize() {
    if(this.font_size <= 19) {
      this.font_size = this.font_size + 1;
    }
  }

  decreaseFontSize() {
    if(this.font_size >= 11) {
      this.font_size = this.font_size - 1;
    }
  }

  backgroundChangeToBlack() {
    this.background_choice = "black";
  }

  backgroundChangeToWhite() {
    this.background_choice = "white";
  }

  backgroundChangeToLightYellow() {
    this.background_choice = "light-yellow";
  }


}
