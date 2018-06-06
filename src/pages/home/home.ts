import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuopcionesPage } from "../index.paginas";
import { AlertController, LoadingController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { PosicionesPage, TabsPage, LoginPage } from "../index.paginas";

import { url } from "../../config/url.config"

import { SharedObjectsProvider } from '../../providers/shared-objects/shared-objects';

import { Platform } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';

import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';

import { App } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  MenuOpciones:any = MenuopcionesPage;
  User = { Email: '' };
  Save = false;
  noBet = false;
  constructor(      public navCtrl: NavController, public navParams: NavParams,
                    public http: Http, public alertCtrl: AlertController,
                    public loadingCtrl: LoadingController,
                    public ctrlSharedObjectsProvider:SharedObjectsProvider, public backgroundMode: BackgroundMode, public platform: Platform, private socket: Socket, public app: App
             )  {

                   if(this.platform.is('cordova')){
                     platform.ready().then(() => {

                       console.log('Entró pendiente de un backgroud');

                       this.backgroundMode.on('activate').subscribe(() => {
                        console.log('Se activó tremendo backgroud');
                       });

                       this.backgroundMode.setDefaults({
                           title: 'Acerté',
                           text: 'Esperando los resultados oficiales...',
                           icon: "res://icon.png"
                       })

                       this.platform.registerBackButtonAction(() => {
                         this.backgroundMode.moveToBackground();
                       });

                       this.backgroundMode.enable();
                     })
                   }

                   // Se une al socket por donde recibirá los resultados de los juegos
                   this.socket.connect();
                   // Llama a algo de coba
                   this.socket.emit('set-email', this.User.Email);

                   this.getMsgs().subscribe(data => {
                     // Al obtener la orden del server procede a llamar a pantalla de resultados
                     console.log('Llegó aquí debería irse a la otra página');
                     console.log(this.app.getActiveNav());
                     // Para que refresque las posiciones cuando vaya
                     this.ctrlSharedObjectsProvider.setRefreshPosition(true);
                     this.ctrlSharedObjectsProvider.setOwnCalc(false);
                     this.navCtrl.parent.select(2);
                   });

                }

  getMsgs() {
    let observable = new Observable(observer => {
      this.socket.on('finishedGame', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  ionViewWillEnter(){
    this.User = this.ctrlSharedObjectsProvider.getUser();
    this.noBet = this.ctrlSharedObjectsProvider.getnoBet();
  }

  onSearchChange(searchValue : string ) {
    this.Save = true;
  }

  keyPress(event: any) {

    this.Save = true;

    const pattern = /[0-9]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  UpdateUser() {

    let mUrl = url + 'api/UpdateUser';

    const body = {User: this.User};

    let loading = this.loadingCtrl.create({
      content: 'Guardando...',
      spinner: 'ios'
    });

    loading.present();

    this.http
      .post( mUrl, body ).subscribe(res => {
        loading.dismiss();

        this.Save = false;

        // Para que refresque las posiciones cuando vaya
        this.ctrlSharedObjectsProvider.setRefreshPosition(true);

        if (res.json().result == 'ok' ){
          this.ctrlSharedObjectsProvider.setUser(res.json().User);
          let alert = this.alertCtrl.create({
            title: 'Listo!',
            subTitle: 'Tu quiniela fue actualizada.',
            buttons: ['Ok']
          });
          alert.present();
        }
        else
        {
          // Caso distinto a OK vuelve a login page
          this.navCtrl.setRoot(LoginPage);
        }
      }
    )

  }

}
