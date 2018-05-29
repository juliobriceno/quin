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
  selector: 'page-contrasena',
  templateUrl: 'contrasena.html',
})
export class ContrasenaPage {
  User = { Password: '', ConfirmPassword: '' };

  constructor(      public navCtrl: NavController, public navParams: NavParams,
                    public http: Http, public alertCtrl: AlertController,
                    public loadingCtrl: LoadingController,
                    public ctrlSharedObjectsProvider:SharedObjectsProvider) {
  }

  ionViewWillEnter(){
    this.User = this.ctrlSharedObjectsProvider.getUser();
  }

  UpdateUser() {

    if (typeof this.User.Password == 'undefined' || typeof this.User.ConfirmPassword == 'undefined' || this.User.Password.trim() == ''){
      let alert = this.alertCtrl.create({
        title: 'Oops!',
        subTitle: 'Debe colocar el nuevo password',
        buttons: ['Ok']
      });
      alert.present();
      return 0;
    }

    if (this.User.Password.trim() != this.User.ConfirmPassword.trim()){
      let alert = this.alertCtrl.create({
        title: 'Oops!',
        subTitle: 'Los Password deben coincidir',
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

    this.http
      .post( mUrl, body ).subscribe(res => {
        loading.dismiss();
        if (res.json().result == 'ok' ){
          this.ctrlSharedObjectsProvider.setUser(res.json().User);
          let alert = this.alertCtrl.create({
            title: 'Ready!',
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
      }
    )

  }

}
