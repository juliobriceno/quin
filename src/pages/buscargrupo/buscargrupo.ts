import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuopcionesPage } from "../index.paginas";
import { AlertController, LoadingController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { PosicionesPage, TabsPage, LoginPage, PreguntasfrecuentesPage } from "../index.paginas";

import { url } from "../../config/url.config"

import { SharedObjectsProvider } from '../../providers/shared-objects/shared-objects';

import { Platform } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';

import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/timeout';

import { App } from 'ionic-angular';

import { ToastController } from 'ionic-angular';

import * as _ from 'lodash';

@Component({
  selector: 'page-buscargrupo',
  templateUrl: 'buscargrupo.html',
})
export class BuscargrupoPage {
  MenuOpciones:any = MenuopcionesPage;
  txtSearch = '';
  Groups:any = [];

  constructor(      public navCtrl: NavController, public navParams: NavParams,
                    public http: Http, public alertCtrl: AlertController,
                    public loadingCtrl: LoadingController,
                    public ctrlSharedObjectsProvider:SharedObjectsProvider, public backgroundMode: BackgroundMode, public platform: Platform, private socket: Socket, public app: App, private toastCtrl: ToastController) {

                      let toast = this.toastCtrl.create({
                        message: 'Escribe algunas letras del grupo que buscas.',
                        duration: 4000,
                        position: 'bottom'
                      });

                      toast.present();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuscargrupoPage');
  }

  selectGroup(Group){
    this.ctrlSharedObjectsProvider.setgoinSearch(true);
    this.ctrlSharedObjectsProvider.setgroupSearch(Group);
    this.navCtrl.pop();
  }

  onInput() {

    let mUrl = url + 'api/getGroups';

    const body = {groupLetters: this.txtSearch};

    let loading = this.loadingCtrl.create({
      content: 'Guardando...',
      spinner: 'ios'
    });

    loading.present();

    this.http.post(mUrl, body)
               .timeout(15000)
               .subscribe((res) => {


                 loading.dismiss();

                 if (res.json().result == 'ok' ){
                   var tempGroups = res.json().Groups;
                   tempGroups = _.orderBy(tempGroups);
                   this.Groups = tempGroups;
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
