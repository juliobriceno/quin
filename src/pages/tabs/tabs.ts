import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { HomePage,PosicionesPage,RegistroPage,SimuladorPage } from "../index.paginas";
/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
   Quiniela:any = HomePage;
   Posicion:any = PosicionesPage;
   Grupo:any = RegistroPage;
   Simulador:any = SimuladorPage;

  constructor() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
