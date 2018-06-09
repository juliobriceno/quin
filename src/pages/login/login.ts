import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage, TabsPage, RecuperarcontrasenaPage } from "../index.paginas";
import { AlertController, LoadingController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { url } from "../../config/url.config"

import 'rxjs/add/operator/timeout';

import { SharedObjectsProvider } from '../../providers/shared-objects/shared-objects';

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
  User = { "Email": "", "Password": "", "ConfirmPassword": "", "Groups": [], "DummyGames": [] };
  UserLogin = { "Email": "", "Password": "" };
  segments:string = '';
  endedGames = [{homegoal: 0, visitorgoal: 0, game: ''}];
  noBet = false;

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
        subTitle: 'Hay campos con errores. Por favor revisa',
        buttons: ['Ok']
      });
      alert.present();
      return 0;
    }

    let mUrl = url + 'public/GetUser';

    const body = {User: this.UserLogin};

    let loading = this.loadingCtrl.create({
      content: 'Comprobando...',
      spinner: 'ios'
    });

    loading.present();

    var self = this;

    this.http.post(mUrl, body)
               .timeout(15000)
               .subscribe((res) => {

                 loading.dismiss();
                 if (res.json().result == 'ok' ){


                   this.User = res.json().User;
                   this.endedGames = res.json().endedGames;

                   // noBet determina si aún se permiten o no quiniela
                   this.noBet = res.json().noBet;
                   this.ctrlSharedObjectsProvider.setnoBet(this.noBet);

                   // Ésta nueva rutina permite verificar si hay juegos bloqueados
                   // Si viene con juegos simulados pasa a sobre escribir todos los juegos siempre y cuando no venga de simulaciones propio
                   // Recorre cada juego simulado si lo consigue entre los juegos ya definidos los marca como están definidos
                   // caso contrario los deja 0 a 0 sin finalizar
                   this.User.DummyGames.forEach(function(eachUserGame){
                     var lendedGame =   [{homegoal: 0, visitorgoal: 0, game: ''}];

                     var lendedGame = self.endedGames.filter(function(endedGame){
                       return endedGame.game == eachUserGame.game
                     })
                     // Si el juego no existe 0 a 0 sin terminar el juego para permitir editar
                     if (lendedGame.length == 0){
                       eachUserGame.isEnded = false;
                       eachUserGame.homegoal = undefined;
                       eachUserGame.visitorgoal = undefined;
                     }
                     // Caso contrario coloca el marcador dque viene y el juego lo coloca cerrado para que no pueda editar
                     else{
                       eachUserGame.isEnded = true;
                       eachUserGame.homegoal = lendedGame[0].homegoal;
                       eachUserGame.visitorgoal = lendedGame[0].visitorgoal;
                     }
                   })

                   this.ctrlSharedObjectsProvider.setUser(this.User);
                   this.navCtrl.setRoot(TabsPage)
                 }
                 else{
                   let alert = this.alertCtrl.create({
                     title: 'Oops!',
                     subTitle: 'El usuario no existe! Ya te registraste?',
                     buttons: ['Ok']
                   });
                   alert.present();        }


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

  CreateUser() {

    if (!this.registerForm.valid) {
      let alert = this.alertCtrl.create({
        title: 'Oops!',
        subTitle: 'Hay campos con error. Por favor revisa.',
        buttons: ['Ok']
      });
      alert.present();
      return 0;
    }

    let mUrl = url + 'public/InsertUser';

    const body = {User: this.User};

    let loading = this.loadingCtrl.create({
      content: 'Creando usuario.',
      spinner: 'ios'
    });

    loading.present();

    this.http.post(mUrl, body)
               .timeout(15000)
               .subscribe((res) => {


                 loading.dismiss();
                 if (res.json().result == 'ok' ){
                   this.ctrlSharedObjectsProvider.setUser(res.json().User);
                   this.navCtrl.setRoot(TabsPage)
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
