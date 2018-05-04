import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import {HomePage,PosicionesPage,TabsPage,RegistroPage,MenuopcionesPage} from '../pages/index.paginas';
import { SharedObjectsProvider } from '../providers/shared-objects/shared-objects';

import { GropByPipe } from '../pipes/grop-by/grop-by';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PosicionesPage,
    RegistroPage,
    TabsPage,
    MenuopcionesPage,
    GropByPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PosicionesPage,
    RegistroPage,
    TabsPage,
    MenuopcionesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SharedObjectsProvider
  ]
})
export class AppModule {}
