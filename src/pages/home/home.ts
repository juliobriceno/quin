import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MenuopcionesPage } from "../index.paginas";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tab10:any = MenuopcionesPage;
  constructor(public navCtrl: NavController) {

  }

}
