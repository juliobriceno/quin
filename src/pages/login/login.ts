import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage, TabsPage, RecuperarcontrasenaPage } from "../index.paginas";
import { AlertController, LoadingController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { url } from "../../config/url.config"

import { SharedObjectsProvider } from '../../providers/shared-objects/shared-objects';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  tab1:any = TabsPage;
  RecuperarContrasena:any = RecuperarcontrasenaPage;
  validate:any={};
  registerForm: FormGroup;
  LoginForm: FormGroup;
  User = { "Email": "", "Password": "", "ConfirmPassword": "" };
  UserLogin = { "Email": "", "Password": "" };
  segments:string = '';

  constructor(      public navCtrl: NavController, public navParams: NavParams,
                    public http: Http, public alertCtrl: AlertController,
                    public loadingCtrl: LoadingController,
                    public ctrlSharedObjectsProvider:SharedObjectsProvider
             )  {
                    this.segments = 'login';
                }

  ngOnInit() {
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.registerForm = new FormGroup({
    ConfirmPassword: new FormControl('', [Validators.required, this.matchValidator('Password') ]),
    Password: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
    });
    this.LoginForm = new FormGroup({
    Password: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
    });
  }

  matchValidator(fieldName: string) {
      let fcfirst: FormControl;
      let fcSecond: FormControl;

      return function matchValidator(control: FormControl) {

          if (!control.parent) {
              return null;
          }

          // INITIALIZING THE VALIDATOR.
          if (!fcfirst) {
              //INITIALIZING FormControl first
              fcfirst = control;
              fcSecond = control.parent.get(fieldName) as FormControl;

              //FormControl Second
              if (!fcSecond) {
                  throw new Error('matchValidator(): Second control is not found in the parent group!');
              }

              fcSecond.valueChanges.subscribe(() => {
                  fcfirst.updateValueAndValidity();
              });
          }

          if (!fcSecond) {
              return null;
          }

          if (fcSecond.value !== fcfirst.value) {
              return {
                  matchOther: true
              };
          }

          return null;
      }
  }

  Login() {

    if (!this.LoginForm.valid) {
      let alert = this.alertCtrl.create({
        title: 'Oops!',
        subTitle: 'Por favor revisa los campos con error.',
        buttons: ['Ok']
      });
      alert.present();
      return 0;
    }

    let mUrl = url + 'public/GetUser';

    const body = {User: this.UserLogin};

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
          this.navCtrl.push( TabsPage )
        }
        else{
          let alert = this.alertCtrl.create({
            title: 'Oops!',
            subTitle: 'El usuario no existe. Ya te registraste?',
            buttons: ['Ok']
          });
          alert.present();        }
      }
    )

  }

  CreateUser() {

    if (!this.registerForm.valid) {
      let alert = this.alertCtrl.create({
        title: 'Oops!',
        subTitle: 'Por favor revisa los campos con error.',
        buttons: ['Ok']
      });
      alert.present();
      return 0;
    }

    let mUrl = url + 'public/InsertUser';

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
          this.navCtrl.push( TabsPage )
        }
        else if (res.json().result == 'userExist' ){
          let alert = this.alertCtrl.create({
            title: 'Oops!',
            subTitle: 'El usuario que intentas crear ya existe.',
            buttons: ['Ok']
          });
          alert.present();
        }
        else{
          let alert = this.alertCtrl.create({
            title: 'Oops!',
            subTitle: 'Ocurrió un error inesperado.',
            buttons: ['Ok']
          });
          alert.present();        }
      }
    )

  }

}
