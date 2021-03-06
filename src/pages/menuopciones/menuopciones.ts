import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage, PerfilPage, ContrasenaPage, PreguntasfrecuentesPage } from "../index.paginas";
import { AlertController, LoadingController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { url } from "../../config/url.config"

import { SharedObjectsProvider } from '../../providers/shared-objects/shared-objects';

import { Platform } from 'ionic-angular';

import 'rxjs/add/operator/timeout';


@Component({
  selector: 'page-menuopciones',
  templateUrl: 'menuopciones.html',
})
export class MenuopcionesPage {

  mPerfilPage:any = PerfilPage;
  mContrasenaPage:any = ContrasenaPage;
  mPreguntasPage:any = PreguntasfrecuentesPage;

  constructor(      public navCtrl: NavController, public navParams: NavParams,
                    public http: Http, public alertCtrl: AlertController,
                    public loadingCtrl: LoadingController,
                    public ctrlSharedObjectsProvider:SharedObjectsProvider, public platform: Platform) {
  }

  closeSession() {

    let mUrl = url + 'api/closeSession';

    const body = {};

    let loading = this.loadingCtrl.create({
      content: 'Cerrando sesión.',
      spinner: 'ios'
    });

    loading.present();


    this.http.post(mUrl, body)
               .timeout(15000)
               .subscribe((res) => {


                 loading.dismiss();

                 if (res.json().result == 'ok' ){
                   this.platform.exitApp();
                 }
                 else
                 {
                   let alert = this.alertCtrl.create({
                     title: 'Oops!',
                     subTitle: 'No se pudo cerrar sesión.',
                     buttons: ['Ok']
                   });
                   alert.present();
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
