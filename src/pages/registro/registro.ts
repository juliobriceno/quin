import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage, MenuopcionesPage } from "../index.paginas";
import { AlertController, LoadingController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { url } from "../../config/url.config"

import { SharedObjectsProvider } from '../../providers/shared-objects/shared-objects';
import { GropByPipe } from '../../pipes/grop-by/grop-by';

@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {
  User = { Groups: [] };
  MenuOpciones:any = MenuopcionesPage;
  newGroupName = '';
  deleteGroup = true;
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
      let newGroup = { Name:this.newGroupName }
      this.User.Groups.push(newGroup);
      this.newGroupName = '';
      this.deleteGroup = false;
      this.UpdateUser();
    }

    UpdateUser() {

      let mUrl = url + 'api/UpdateUser';

      const body = {User: this.User};

      let loading = this.loadingCtrl.create({
        content: 'Working...',
        spinner: 'ios'
      });

      loading.present();

      this.http
        .post( mUrl, body ).subscribe(res => {
          loading.dismiss();
          if (res.json().result == 'ok' ){
            this.ctrlSharedObjectsProvider.setUser(res.json().User);
            if (this.deleteGroup == true){
              let alert = this.alertCtrl.create({
                title: 'Ready!',
                subTitle: 'El grupo fue eliminado...',
                buttons: ['Ok']
              });
              alert.present();
            }
            else{
              if (res.json().newGroup == true ){
                let alert = this.alertCtrl.create({
                  title: 'Ready!',
                  subTitle: 'Has creador un nuevo grupo...',
                  buttons: ['Ok']
                });
                alert.present();
              }
              else{
                let alert = this.alertCtrl.create({
                  title: 'Ready!',
                  subTitle: 'Te uniste al grupo...',
                  buttons: ['Ok']
                });
                alert.present();
              }
            }
          }
          else
          {
            let alert = this.alertCtrl.create({
              title: 'Oops!',
              subTitle: 'El usuario no existe. Ya te registraste?',
              buttons: ['Ok']
            });
            alert.present();
          }
        }
      )

    }

}
