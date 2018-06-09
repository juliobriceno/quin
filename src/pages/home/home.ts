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

import 'rxjs/add/operator/timeout';

import { App } from 'ionic-angular';

import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  MenuOpciones:any = MenuopcionesPage;
  User = { Email: '', Groups: [] };
  Save = false;
  noBet = false;
  constructor(      public navCtrl: NavController, public navParams: NavParams,
                    public http: Http, public alertCtrl: AlertController,
                    public loadingCtrl: LoadingController,
                    public ctrlSharedObjectsProvider:SharedObjectsProvider, public backgroundMode: BackgroundMode, public platform: Platform, private socket: Socket, public app: App, private toastCtrl: ToastController
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

                   // // Se une al socket por donde recibirá los resultados de los juegos
                   // this.socket.connect();
                   // // Llama a algo de coba
                   // this.socket.emit('set-email', this.User.Email);
                   //
                   // this.getMsgs().subscribe(data => {
                   //   // Al obtener la orden del server procede a llamar a pantalla de resultados
                   //   // Para que refresque las posiciones cuando vaya
                   //   this.ctrlSharedObjectsProvider.setRefreshPosition(true);
                   //   this.ctrlSharedObjectsProvider.setOwnCalc(false);
                   //   this.navCtrl.parent.select(2);
                   // });
                   //
                   // this.getGroupsMsg().subscribe(data => {
                   //   // Al obtener la orden del server procede a llamar a pantalla de resultados
                   //   // Para que refresque las posiciones cuando vaya
                   //   // Al recibir datos del server de personas añadidas a grupo verifica si es uno de los grupos del usuario actual, si lo es prepara
                   //   // para actualizar resultados y avisa que hay nuevas personas en el grupo
                   //
                   //   // Si el mensaje viene de un usuario distinto a éste y tiene grupos en donde está éste usuario
                   //   // avisa que hay integrantes nuevos
                   //   var self = this;
                   //
                   //   if (data['Email'] != this.User.Email){
                   //     data['punionGroups'].forEach(function(punionGroup){
                   //       self.User.Groups.forEach(function(eachUserGroup){
                   //         if (eachUserGroup.Name == punionGroup.groupAdded){
                   //
                   //            self.ctrlSharedObjectsProvider.setRefreshPosition(true);
                   //            self.ctrlSharedObjectsProvider.setOwnCalc(false);
                   //
                   //            let toast = self.toastCtrl.create({
                   //              message: 'Hay un nuevo usuario en algunos de tus grupos.',
                   //              duration: 4000,
                   //              position: 'bottom'
                   //            });
                   //
                   //            toast.present();
                   //
                   //         }
                   //       })
                   //     })
                   //   }
                   //
                   // });

                   let toast = this.toastCtrl.create({
                     message: 'Aquí debes agregar tus pronósticos.',
                     duration: 4000,
                     position: 'bottom'
                   });

                   toast.present();

                }

  // getMsgs() {
  //   let observable = new Observable(observer => {
  //     this.socket.on('finishedGame', (data) => {
  //       observer.next(data);
  //     });
  //   });
  //   return observable;
  // }
  //
  // getGroupsMsg() {
  //   let observable2 = new Observable(observer2 => {
  //     this.socket.on('groupsChange', (data2) => {
  //       observer2.next(data2);
  //     });
  //   });
  //   return observable2;
  // }

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

    this.http.post(mUrl, body)
               .timeout(15000)
               .subscribe((res) => {


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


               }, (errorResponse: any) => {

                 loading.dismiss();

                 let alert = this.alertCtrl.create({
                   title: 'Oops!',
                   subTitle: 'Pareces tener problemas de conexión a internet',
                   buttons: ['Ok']
                 });
                 alert.present();

               });


  }

}
