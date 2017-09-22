import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AboutPage } from './../pages/about/about';
import { SettingsPage } from '../pages/settings/settings';
import { GetApiTutorialPage } from './../pages/get-api-tutorial/get-api-tutorial';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any, icon: any}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public storage: Storage
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, icon: 'home' },
      { title: 'Settings', component: SettingsPage, icon: 'settings' },
      { title: 'About', component: AboutPage, icon: 'pricetag' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      // set default background and font-size
      this.storage.ready().then(() => {
        this.storage.get('font_size').then(font_size => {
          if(!font_size) {
            this.storage.set('font_size', 13);
          }
        });
        this.storage.get('bg_choice').then(bg_choice => {
          if(!bg_choice) {
            this.storage.set('bg_choice', 'light-yellow');
          }
        });
      })

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
