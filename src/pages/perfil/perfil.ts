import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage, MenuopcionesPage } from "../index.paginas";
import { AlertController, LoadingController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { url } from "../../config/url.config"

import { SharedObjectsProvider } from '../../providers/shared-objects/shared-objects';

import 'rxjs/add/operator/timeout';


@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  User = { Alias: '' };

  constructor(      public navCtrl: NavController, public navParams: NavParams,
                    public http: Http, public alertCtrl: AlertController,
                    public loadingCtrl: LoadingController,
                    public ctrlSharedObjectsProvider:SharedObjectsProvider) {
  }

  ionViewWillEnter(){
    this.User = this.ctrlSharedObjectsProvider.getUser();
  }

  UpdateUser() {

    if (this.User.Alias.trim() == ''){
      let alert = this.alertCtrl.create({
        title: 'Oops!',
        subTitle: 'Debes colocar un Alias.',
        buttons: ['Ok']
      });
      alert.present();
      return 0;
    }

    let mUrl = url + 'api/UpdateUser';

    const body = {User: this.User};

    let loading = this.loadingCtrl.create({
      content: 'Working...',
      spinner: 'ios'
    });

    loading.present();



        this.http.post(mUrl, body)
                   .timeout(15000)
                   .subscribe((res) => {


                     loading.dismiss();
                     if (res.json().result == 'ok' ){
                       this.ctrlSharedObjectsProvider.setUser(res.json().User);
                       let alert = this.alertCtrl.create({
                         title: 'Listo!',
                         subTitle: 'Los datos fueron actualizados...',
                         buttons: ['Ok']
                       });
                       alert.present();
                     }
                     else
                     {
                       let alert = this.alertCtrl.create({
                         title: 'Oops!',
                         subTitle: 'El usuario no existe. Ya te registraste?',
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
