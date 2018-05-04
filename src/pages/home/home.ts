import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage, MenuopcionesPage } from "../index.paginas";
import { AlertController, LoadingController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { url } from "../../config/url.config"

import { SharedObjectsProvider } from '../../providers/shared-objects/shared-objects';
import { GropByPipe } from '../../pipes/grop-by/grop-by';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tab10:any = MenuopcionesPage;
  User = { };
  constructor(      public navCtrl: NavController, public navParams: NavParams,
                    public http: Http, public alertCtrl: AlertController,
                    public loadingCtrl: LoadingController,
                    public ctrlSharedObjectsProvider:SharedObjectsProvider
             )  {
                }

  ionViewWillEnter(){
    this.User = this.ctrlSharedObjectsProvider.getUser();
  }

  keyPress(event: any) {
    const pattern = /[0-9]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
