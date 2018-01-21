import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { Storage } from '@ionic/storage';
import { PaperDataProvider } from '../../providers/paper-data/paper-data';
import { UserDataProvider } from '../../providers/user-data/user-data';

@Component({
  selector: 'page-paper-detail',
  templateUrl: 'paper-detail.html',
})
export class PaperDetailPage {
  
  paper_url: string = "";
  paper_text: string = "";
  title: string = "";
  is_from_storage: boolean;
  paper_metadata: any;

  pdf_extraction_api_endpoint: string = "";
  api_key: string;

  error_msg: any = "";

  storage_directory: any;
  filename: string;
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
    public transfer: FileTransfer,
    private document: DocumentViewer,
    private paperDataProvider: PaperDataProvider,
    private userDataProvider: UserDataProvider
  ) {
  }

  ionViewDidLoad() {
    this.userDataProvider.storageLocationChanged.subscribe(storage_location => this.storage_directory = storage_location);

    this.paper_url = this.navParams.get("paper_url");
    this.api_key = this.navParams.get("api_key");
    this.is_from_storage = this.navParams.get("is_from_storage");

    this.userDataProvider.fontSizeChanged.subscribe(font_size => this.font_size = font_size);
    this.userDataProvider.backgroundChoiceChanged.subscribe(bg_choice => this.background_choice = bg_choice);

    this.pdf_extraction_api_endpoint = this.userDataProvider.getPdfExtractionApiEndpoint();

    this.pdfExtraction();  
  }

  pdfExtraction() {
    let loader = this.loadingCtrl.create({
      content: "Please wait for your paper to be parsed..."
    });
    loader.present();

    // in storage
    if(this.is_from_storage) {
      this.storage.get(this.paper_url).then(paper_content => {
        loader.dismiss();
        this.paper_text = paper_content.text;
        this.filename = paper_content.filename;
        this.title = paper_content.title;
      }).catch(err => {
        loader.dismiss();
        this.error_msg = "Storage error! | " + err;
      });
      return;
    }

    // new document
    // download pdf to local file system
    const fileTransfer: FileTransferObject = this.transfer.create();
    this.filename = new Date().getTime().toString() + ".pdf";
    fileTransfer.download(this.paper_url, this.storage_directory + '/' + this.filename).then((entry) => {
      // download complete
      console.log('download complete: ' + entry.toURL());

      // base64 encode the pdf
      this.file.readAsDataURL(this.storage_directory, this.filename).then(dataURL => {
        // console.log(dataURL);
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
            images: false,
            tables: false,
            metadata: true
          }
          this.http.post(this.pdf_extraction_api_endpoint, JSON.stringify(body))
            .map(res => res.json())
            .subscribe(databack => {
              // successfully got the databack
              loader.dismiss();
              let paper_content = databack.results;

              // present the texts
              this.paper_text = paper_content.text;
              this.title = this.paper_text.substring(0, this.paper_text.indexOf('\n\n')).trim().replace('\n', ': ');
              paper_content['title'] = this.title;
              paper_content['filename'] = this.filename;

              // store the parsed results
              this.paperDataProvider.storePaperContent(this.paper_url, paper_content);

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

  }

  viewOriginalDocument() {
    const options: DocumentViewerOptions = {
      title: this.title,
      openWith: {enabled: true}
    }
    this.document.viewDocument(this.storage_directory + '/' + this.filename, 'application/pdf', options)
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
