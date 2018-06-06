import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage, MenuopcionesPage, LoginPage } from "../index.paginas";
import { AlertController, LoadingController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { url } from "../../config/url.config"

import { SharedObjectsProvider } from '../../providers/shared-objects/shared-objects';

@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {
  User = { Groups: [] };
  MenuOpciones:any = MenuopcionesPage;
  newGroupName = '';
  deleteGroup = true;
  fromGroup = false;
  constructor(      public navCtrl: NavController, public navParams: NavParams,
                    public http: Http, public alertCtrl: AlertController,
                    public loadingCtrl: LoadingController,
                    public ctrlSharedObjectsProvider:SharedObjectsProvider) {
  }


    ionViewWillEnter(){
      this.User = this.ctrlSharedObjectsProvider.getUser();
    }

    DeleteGroup(groupName) {
      this.User.Groups = this.User.Groups.filter(function(userGroup){
        return userGroup.Name != groupName;
      })
      this.deleteGroup = true;
      this.fromGroup = true;
      this.UpdateUser();
    }

    AddGroup() {
      if (this.newGroupName.trim() == ''){
        let alert = this.alertCtrl.create({
          title: 'Oops!',
          subTitle: 'Debe colocarle un nombre al grupo',
          buttons: ['Ok']
        });
        alert.present();
        return 0;
      }
      let newGroup = { Name:this.newGroupName, BetType: 1 }
      this.User.Groups.push(newGroup);
      this.newGroupName = '';
      this.deleteGroup = false;
      this.fromGroup = true;
      this.UpdateUser();
    }

    UpdateUser() {

      let mUrl = url + 'api/UpdateUser';

      const body = {User: this.User};

      let loading = this.loadingCtrl.create({
        content: 'Actualizando datos.',
        spinner: 'ios'
      });

      loading.present();

      this.http
        .post( mUrl, body ).subscribe(res => {
          loading.dismiss();
          if (res.json().result == 'ok' ){
            this.ctrlSharedObjectsProvider.setUser(res.json().User);
            if (this.fromGroup == false){
              let alert = this.alertCtrl.create({
                title: 'Listo!',
                subTitle: 'Cambiaste el tipo de juego del grupo.',
                buttons: ['Ok']
              });
              alert.present();
            }
            else{
              if (this.deleteGroup == true){
                let alert = this.alertCtrl.create({
                  title: 'Listo!',
                  subTitle: 'Eliminaste el grupo.',
                  buttons: ['Ok']
                });
                alert.present();
              }
              else{
                if (res.json().newGroup == true ){
                  let alert = this.alertCtrl.create({
                    title: 'Listo!',
                    subTitle: 'Felicitaciones! Has creado un nuevo grupo.',
                    buttons: ['Ok']
                  });
                  alert.present();
                }
                else{
                  let alert = this.alertCtrl.create({
                    title: 'Listo!',
                    subTitle: 'Te has unido a un grupo.',
                    buttons: ['Ok']
                  });
                  alert.present();
                }
              }
            }
            // Para que refresque las posiciones cuando vaya
            this.ctrlSharedObjectsProvider.setRefreshPosition(true);
          }
          else
          {
            // Caso distinto a OK vuelve a login page
            this.navCtrl.setRoot(LoginPage);
          }
          this.fromGroup = false;
        }
      )

    }

}
