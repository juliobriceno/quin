import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuopcionesPage } from "../index.paginas";
/**
 * Generated class for the SimuladorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-simulador',
  templateUrl: 'simulador.html',
})
export class SimuladorPage {
  MenuOpciones:any = MenuopcionesPage;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SimuladorPage');
  }

}
