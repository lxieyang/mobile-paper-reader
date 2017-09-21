import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

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
  api_key: string = "8f83c2a04a9312b132fb6f88d8c90c2d";

  error_msg: any = "";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public http: Http
  ) {
    this.paper_url = this.navParams.get("paper_url");
    this.pdfExtraction();
  }

  pdfExtraction() {
    let loader = this.loadingCtrl.create({
      content: "Please wait for your paper to be parsed..."
    });
    loader.present();

    let body = {
      api_key: this.api_key,
      data: this.paper_url,
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
        console.log(databack.results.text);
      }, err => {
        loader.dismiss();

        console.log(err);
        console.log(JSON.parse(err._body).error);

        this.error_msg = JSON.parse(err._body).error;
      });
  }

}
