import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';

import { APP_VERSION, PDF_EXTRACTION_API_ENDPOINT } from '../../config';

@Injectable()
export class UserDataProvider {

  apiKeyChanged = new ReplaySubject<any>();
  storageLocationChanged = new ReplaySubject<any>();
  fontSizeChanged = new ReplaySubject<any>();
  backgroundChoiceChanged = new ReplaySubject<any>();
  cleverdoxViewerStatusChanged = new ReplaySubject<any>();
  platformChanged = new ReplaySubject<any>();

  pdf_extraction_api_endpoint: string = PDF_EXTRACTION_API_ENDPOINT;
  
  
  constructor(
    private storage: Storage,
    private platform: Platform,
    private file: File
  ) {
    this.init();
  }

  init() {
    this.getAPI();    
    this.getPlatform();
    this.getStorageLocation();
    this.getFontSize();
    this.getBackgroundChoice();
    this.getCleverdoxStatus();
  }

  getPlatform() {
    this.platform.ready().then(() => {
      if (this.platform.is('ios')) {
        this.platformChanged.next('ios');
      } else if (this.platform.is('android')) {
        this.platformChanged.next('android');
      } else {
        this.platformChanged.next('others');
      }
    });
  }

  getAPI() {
    this.storage.ready().then(() => {
      // get API key
      this.storage.get('api_key').then((key) => {
        if (key != null && key.length == 32) {
          // valid key
          this.apiKeyChanged.next(key);
        } else {
          this.apiKeyChanged.next('');
        }
      }).catch(err => {
        console.log("storage error");
        console.log(err);
      });
    });
  }

  setAPI(api_key: string) {
    this.storage.ready().then(() => {
      this.storage.set("api_key", api_key).then(() => {
        this.apiKeyChanged.next(api_key);
      });
    });
  }

  removeAPI() {
    this.storage.ready().then(() => {
      this.storage.remove("api_key").then(() => {
        this.apiKeyChanged.next(null);
      });
    });
  }

  getFontSize() {
    this.storage.ready().then(() => {
      this.storage.get('font_size').then(font_size => {
        this.fontSizeChanged.next(font_size);
      });
    });
  }

  setFontSize(font_size: any) {
    this.storage.ready().then(() => {
      this.storage.set('font_size', font_size).then(() => {
        this.fontSizeChanged.next(font_size);
      });
    });
  }

  getCleverdoxStatus() {
    this.storage.ready().then(() => {
      this.storage.get('cleverdox_status').then(status => {
        console.log("cleverdox status: ", status);
        if (status == null) {
          this.storage.set('cleverdox_status', false);
          this.cleverdoxViewerStatusChanged.next(false);
        } else {
          this.cleverdoxViewerStatusChanged.next(status);
        }
      })
    });
  }

  setCleverdoxStatus(status: boolean) {
    this.storage.ready().then(() => {
      this.storage.set('cleverdox_status', status).then(() => {
        console.log("cleverdox status set to: ", status);
        this.cleverdoxViewerStatusChanged.next(status);
      })
    });
  }

  setDefaultFontSize(font_size: any) {
    this.storage.ready().then(() => {
      this.storage.get('font_size').then(original_font_size => {
        if(!original_font_size) {
          this.storage.set('font_size', font_size).then(() => {
            this.fontSizeChanged.next(font_size);
          });
        }
      });
    });
  }

  getBackgroundChoice() {
    this.storage.ready().then(() => {
      this.storage.get('bg_choice').then(bg_choice => {
        this.backgroundChoiceChanged.next(bg_choice);
      });
    });
  }

  setBackgroundChoice(background_choice: string) {
    this.storage.ready().then(() => {
      this.storage.set('bg_choice', background_choice).then(() => {
        this.backgroundChoiceChanged.next(background_choice);
      });
    });
  }

  setDefaultBackgroundChoice(background_choice: string) {
    this.storage.ready().then(() => {
      this.storage.get('bg_choice').then(original_bg_choice => {
        if(!original_bg_choice) {
          this.storage.set('bg_choice', background_choice).then(() => {
            this.backgroundChoiceChanged.next(background_choice);
          });
        }
      });
    });
  }

  getStorageLocation() {
    this.platform.ready().then(() => {
      let storage_location: any;
      if (this.platform.is('android')) {
        storage_location = this.file.externalDataDirectory;
      } else {  // ios
        storage_location = this.file.dataDirectory;
      }
      this.storageLocationChanged.next(storage_location);
    });
  }

  getPdfExtractionApiEndpoint() {
    return this.pdf_extraction_api_endpoint;
  }

  getAppVersion() {
    return APP_VERSION;
  }

}
