import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage, MenuopcionesPage } from "../index.paginas";
import { AlertController, LoadingController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { url } from "../../config/url.config"

import { SharedObjectsProvider } from '../../providers/shared-objects/shared-objects';
import * as _ from 'lodash';

import { NgModule } from '@angular/core';

@Component({
  selector: 'page-quinielagrupo',
  templateUrl: 'quinielagrupo.html'
})
export class QuinielagrupoPage {
  User = { };

  constructor(      public navCtrl: NavController, public navParams: NavParams,
                    public http: Http, public alertCtrl: AlertController,
                    public loadingCtrl: LoadingController,
                    public ctrlSharedObjectsProvider:SharedObjectsProvider) {
  }


    ionViewWillEnter(){
      this.User = this.ctrlSharedObjectsProvider.getanotherUser();
    }

}
