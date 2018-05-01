import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PosicionesPage } from './posiciones';

@NgModule({
  declarations: [
    PosicionesPage,
  ],
  imports: [
    IonicPageModule.forChild(PosicionesPage),
  ],
})
export class PosicionesPageModule {}
