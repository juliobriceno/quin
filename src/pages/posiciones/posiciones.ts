import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuopcionesPage,QuinielagrupoPage } from "../index.paginas";
/**
 * Generated class for the PosicionesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-posiciones',
  templateUrl: 'posiciones.html',
})
export class PosicionesPage {
  MenuOpciones:any = MenuopcionesPage;
  QuinielaGrupo:any = QuinielagrupoPage;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PosicionesPage');
  }

}
