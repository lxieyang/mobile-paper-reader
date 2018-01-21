import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AboutPage } from './../pages/about/about';
import { PaperDetailPage } from './../pages/paper-detail/paper-detail';
import { SettingsPage } from '../pages/settings/settings';
import { GetApiTutorialPage } from './../pages/get-api-tutorial/get-api-tutorial';
import { TabsPage } from '../pages/tabs/tabs';
import { HistoryPage } from '../pages/history/history';

import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { FileTransfer } from '@ionic-native/file-transfer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { File } from '@ionic-native/file';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { AutoresizeDirective } from './autoresize';
import { Clipboard } from '@ionic-native/clipboard';
import { PaperDataProvider } from '../providers/paper-data/paper-data';
import { UserDataProvider } from '../providers/user-data/user-data';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PaperDetailPage,
    SettingsPage,
    AboutPage,
    GetApiTutorialPage,
    AutoresizeDirective,
    TabsPage,
    HistoryPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PaperDetailPage,
    SettingsPage,
    AboutPage,
    GetApiTutorialPage,
    TabsPage,
    HistoryPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileTransfer,
    DocumentViewer,
    Clipboard,
    InAppBrowser,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PaperDataProvider,
    UserDataProvider
  ]
})
export class AppModule {}
