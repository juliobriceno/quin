import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage, PerfilPage, ContrasenaPage } from "../index.paginas";
import { AlertController, LoadingController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { url } from "../../config/url.config"

import { SharedObjectsProvider } from '../../providers/shared-objects/shared-objects';

import { Platform } from 'ionic-angular';


@Component({
  selector: 'page-menuopciones',
  templateUrl: 'menuopciones.html',
})
export class MenuopcionesPage {

  mPerfilPage:any = PerfilPage;
  mContrasenaPage:any = ContrasenaPage;

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

    this.http
      .post( mUrl, body ).subscribe(res => {
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
      }
    )

  }

}
