import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PerfilPage,ContrasenaPage } from "../index.paginas";

/**
 * Generated class for the MenuopcionesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menuopciones',
  templateUrl: 'menuopciones.html',
})
export class MenuopcionesPage {
  Perfil:any =  PerfilPage;
  Contrasena:any =  ContrasenaPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuopcionesPage');
  }

}
