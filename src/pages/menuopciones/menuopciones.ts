import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage, MenuopcionesPage } from "../index.paginas";
import { AlertController, LoadingController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { url } from "../../config/url.config"

import { SharedObjectsProvider } from '../../providers/shared-objects/shared-objects';
import { GropByPipe } from '../../pipes/grop-by/grop-by';



@IonicPage()
@Component({
  selector: 'page-menuopciones',
  templateUrl: 'menuopciones.html',
})
export class MenuopcionesPage {
  Perfil:any =  PerfilPage;
  Contrasena:any =  ContrasenaPage;

  constructor(      public navCtrl: NavController, public navParams: NavParams,
                    public http: Http, public alertCtrl: AlertController,
                    public loadingCtrl: LoadingController,
                    public ctrlSharedObjectsProvider:SharedObjectsProvider) {
  }

  closeSession() {

    let mUrl = url + 'api/closeSession';

    const body = {};

    let loading = this.loadingCtrl.create({
      content: 'Working...',
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
