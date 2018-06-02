import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage, MenuopcionesPage, LoginPage } from "../index.paginas";
import { AlertController, LoadingController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { url } from "../../config/url.config"

import { SharedObjectsProvider } from '../../providers/shared-objects/shared-objects';
import { GropByPipe } from '../../pipes/grop-by/grop-by';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-simulador',
  templateUrl: 'simulador.html',
})
export class SimuladorPage {
  MenuOpciones:any = MenuopcionesPage;
  User = { DummyGames: [] };
  Save = false;
  constructor(      public navCtrl: NavController, public navParams: NavParams,
                    public http: Http, public alertCtrl: AlertController,
                    public loadingCtrl: LoadingController,
                    public ctrlSharedObjectsProvider:SharedObjectsProvider) {
  }

  ionViewWillEnter(){
    this.User = this.ctrlSharedObjectsProvider.getUser();
    this.User.DummyGames = _.orderBy(this.User.DummyGames, ['gamedateid'],['asc']);
  }

  onSearchChange(searchValue : string ) {
    this.Save = true;
  }

  keyPress(event: any) {
    const pattern = /[0-9]/;

    this.Save = true;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  UpdateUser() {

    let mUrl = url + 'api/UpdateUser';

    // this.User.DummyGames.forEach(function(eachGame){
    //
    //   if (typeof eachGame.homegoal == 'string' && eachGame.homegoal.trim() == '' ){
    //     eachGame.homegoal = 0;
    //   }
    //   if (typeof eachGame.visitorgoal == 'string' && eachGame.visitorgoal.trim() == '' ){
    //     eachGame.visitorgoal = 0;
    //   }
    // })

    const body = {User: this.User};

    let loading = this.loadingCtrl.create({
      content: 'Actualizando resultados.',
      spinner: 'ios'
    });

    loading.present();

    this.http
      .post( mUrl, body ).subscribe(res => {
        loading.dismiss();

        this.Save = false;

        // Para que refresque las posiciones cuando vaya
        this.ctrlSharedObjectsProvider.setRefreshPosition(true);
        this.ctrlSharedObjectsProvider.setOwnCalc(true);

        if (res.json().result == 'ok' ){
          this.ctrlSharedObjectsProvider.setUser(res.json().User);

          let alert = this.alertCtrl.create({
            title: 'Listo!',
            subTitle: 'Los datos fueron actualizados.',
            buttons: ['Ok']
          });
          alert.present();

        }
        else
        {
          // Caso distinto a OK vuelve a login page
          this.navCtrl.setRoot(LoginPage);
        }
      }
    )

  }

}
