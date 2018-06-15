import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
// import {HomePage,PosicionesPage,TabsPage,RegistroPage,MenuopcionesPage,PerfilPage,ContrasenaPage,QuinielagrupoPage,RecuperarcontrasenaPage,SimuladorPage} from '../pages/index.paginas';
import {HomePage, SimuladorPage, QuinielagrupoPage, PosicionesPage, RegistroPage, TabsPage, MenuopcionesPage, PerfilPage, ContrasenaPage, RecuperarcontrasenaPage, LoginPage, BuscargrupoPage,PreguntasfrecuentesPage} from '../pages/index.paginas';
import { SharedObjectsProvider } from '../providers/shared-objects/shared-objects';

// import { GropByPipe } from '../pipes/grop-by/grop-by';
import { SeparatorPipe } from '../pipes/separator/separator';

import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
// const config: SocketIoConfig = { url: 'https://jokaquiniela.herokuapp.com', options: {} };
const config: SocketIoConfig = { url: 'http://192.168.1.126:3000', options: {} };

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SeparatorPipe,
    SimuladorPage,
    QuinielagrupoPage,
    PosicionesPage,
    RegistroPage,
    TabsPage,
    MenuopcionesPage,
    PerfilPage,
    ContrasenaPage,
    RecuperarcontrasenaPage,
    LoginPage,
    BuscargrupoPage,
    PreguntasfrecuentesPage
    // GroupByPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PosicionesPage,
    RegistroPage,
    TabsPage,
    PerfilPage,
    ContrasenaPage,
    QuinielagrupoPage,
    MenuopcionesPage,
    SimuladorPage,
    RecuperarcontrasenaPage,
    LoginPage,
    BuscargrupoPage,
    PreguntasfrecuentesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SharedObjectsProvider,
    BackgroundMode,
    LocalNotifications
  ]
})
export class AppModule {}
