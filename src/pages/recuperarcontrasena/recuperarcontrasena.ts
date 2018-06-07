import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage, TabsPage } from "../index.paginas";
import { AlertController, LoadingController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { url } from "../../config/url.config"

import { SharedObjectsProvider } from '../../providers/shared-objects/shared-objects';

import 'rxjs/add/operator/timeout';

@Component({
  selector: 'page-recuperarcontrasena',
  templateUrl: 'recuperarcontrasena.html',
})
export class RecuperarcontrasenaPage {
  UserLogin = { "Email": "", "Password": "" };
  LoginForm: FormGroup;

  constructor(      public navCtrl: NavController, public navParams: NavParams,
                    public http: Http, public alertCtrl: AlertController,
                    public loadingCtrl: LoadingController,
                    public ctrlSharedObjectsProvider:SharedObjectsProvider) {
  }

  ngOnInit() {
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.LoginForm = new FormGroup({
    Password: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
    });
  }

  RecoverPassword(){

    if (!this.LoginForm.controls.Email.valid) {
      let alert = this.alertCtrl.create({
        title: 'Oops!',
        subTitle: 'Por favor revisa los campos con error.',
        buttons: ['Ok']
      });
      alert.present();
      return 0;
    }

    let mUrl = url + 'public/RecoverPassword';

    const body = {User: this.UserLogin};

    let loading = this.loadingCtrl.create({
      content: 'Working...',
      spinner: 'ios'
    });

    loading.present();

    this.http.post(mUrl, body)
               .timeout(15000)
               .subscribe((res) => {


                 loading.dismiss();
                 if (res.json().result == 'userExist' ){
                   let alert = this.alertCtrl.create({
                     title: 'Oops!',
                     subTitle: 'El usuario no existe. Ya te registraste?',
                     buttons: ['Ok']
                   });
                   alert.present();
                 }
                 else if (res.json().result == 'error'){
                   let alert = this.alertCtrl.create({
                     title: 'Oops!',
                     subTitle: 'Ocurrió un error inesperado.',
                     buttons: ['Ok']
                   });
                   alert.present();
                 }
                 else {
                   let alert = this.alertCtrl.create({
                     title: 'Genial!',
                     subTitle: 'Hemos enviado una contraseña temporal a tu correo.',
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
