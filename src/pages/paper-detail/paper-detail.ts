import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform, AlertController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

/**
 * Generated class for the PaperDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-paper-detail',
  templateUrl: 'paper-detail.html',
})
export class PaperDetailPage {
  
  paper_url: string = "";
  paper_text: string = "";
  paper_metadata: any;

  pdf_extraction_api_endpoint: string = "https://apiv2.indico.io/pdfextraction";
  api_key: string;

  error_msg: any = "";

  storage_directory: any;
  filename: string = "paper-to-read.pdf"
  dataURL: string;
  pdf_prefix = "data:application/pdf;base64,";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public http: Http,
    public platform: Platform,
    public file: File,
    public transfer: FileTransfer
  ) {
    this.platform.ready().then(() => {
      if(this.platform.is('android')) {
        this.storage_directory = this.file.externalDataDirectory;
      } else {  // ios
        this.storage_directory = this.file.dataDirectory;
      }

      console.log("file stored at: " + this.storage_directory);

      this.paper_url = this.navParams.get("paper_url");
      this.api_key = this.navParams.get("api_key");
      this.pdfExtraction();  
    })
    
  }

  pdfExtraction() {
    let loader = this.loadingCtrl.create({
      content: "Please wait for your paper to be parsed..."
    });
    loader.present();

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
          this.error_msg = "Invalid PDF file!"
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
              loader.dismiss();
              let results = databack.results;
              this.paper_text = results.text;
              console.log(databack.results.images);
            }, err => {
              loader.dismiss();
              console.log(err);
              console.log(JSON.parse(err._body).error);
              this.error_msg = JSON.parse(err._body).error;
            });
        }

      }).catch(error => {
        loader.dismiss();
        console.log("encode base64 failed");
        this.error_msg = "Cannot read file!"
        console.log(error);
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
    this.file.removeFile(this.storage_directory, this.filename);
  }

}
