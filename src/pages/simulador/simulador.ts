import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage, MenuopcionesPage } from "../index.paginas";
import { AlertController, LoadingController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { url } from "../../config/url.config"

import { SharedObjectsProvider } from '../../providers/shared-objects/shared-objects';
import { GropByPipe } from '../../pipes/grop-by/grop-by';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-simulador',
  templateUrl: 'simulador.html',
})
export class SimuladorPage {
  MenuOpciones:any = MenuopcionesPage;
  User = { };
  constructor(      public navCtrl: NavController, public navParams: NavParams,
                    public http: Http, public alertCtrl: AlertController,
                    public loadingCtrl: LoadingController,
                    public ctrlSharedObjectsProvider:SharedObjectsProvider) {
  }

  ionViewWillEnter(){
    this.User = this.ctrlSharedObjectsProvider.getUser();
    this.User.DummyGames = _.orderBy(this.User.DummyGames, ['gamedateid'],['asc']);
  }

  keyPress(event: any) {
    const pattern = /[0-9]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

processResults(pUsers, userEmail, isSimulated){

  var Data = {};
  Data.Users = pUsers;
  // Calcula el tipo de jugada BetType == 1 es que el que pega el ganador o empate gana 1 punto, caso contrario 0 puntos BetType == 2
  // es que el que acierta ganador o empate gana 1 punto (Si además acierta resultado gana 1 punto adicional)
  // Recorre cada usuario del grupo para estimar la cantidad de puntos según el BetType
  var UsersPlayers = [];

  // El usuario de donde se sacará el Dummy Game
  var userDummyGame = Data.Users.filter(function(usr){
    return usr.Email == userEmail;
  })[0];

  Data.Users.forEach(function(User){
    // Verifica el tipo de jugada. Se busca al administrador que es el que la tiene)
    var myBetType = 1
    User.Groups.forEach(function(userGroup){
      if ( userGroup.Name == 'MySuperGroup' && userGroup.IsAdmin == true ){
        myBetType = userGroup.BetType;
      }
    })
    var UserPlayer = {};
    UserPlayer.Alias = User.Alias;
    UserPlayer.Score = 0;

    // Recorre todos los pronósticos
    User.Games.forEach(function(UserGame){
      // Por cada pronóstico busca cada resultado si lo acertó y el BetType == 1 (1 punto) si además el BetType == 2 y acertó el resultado 1 punto más. Sólo
      // los juegos que se hayan considerado terminado. Los pronóstico son del usuario que se le pase a ésta función

      var myUserDummyGame = userDummyGame.DummyGames.filter(function(UserDummyGame){
        return UserDummyGame.game == UserGame.game && typeof UserDummyGame.IsEnd != 'undefined' && UserDummyGame.IsEnd == true
      })[0];

      // Si no devolvió nada es que el juego no está finalizado y no aumenta el Score a nadie
      if (typeof myUserDummyGame != 'undefined')
      {
        if
        (
          // Si fue empate el resultado y se predijo empate
          (myUserDummyGame.homegoal == myUserDummyGame.visitorgoal && UserGame.homegoal == UserGame.visitorgoal ) ||
          // Or fue vistoria del local y se predijo victoria del local
          (myUserDummyGame.homegoal > myUserDummyGame.visitorgoal && UserGame.homegoal > UserGame.visitorgoal ) ||
          // Or fue victoria del visitante y se predijo victoria del visitante
          (myUserDummyGame.homegoal < myUserDummyGame.visitorgoal && UserGame.homegoal < UserGame.visitorgoal )
        )
        {
          UserPlayer.Score += 1;
        }
        // Además si acertó el resultado exacto 1 punto adicional
        if (myBetType == 2){
          if
          (
            // Si el resultado pronosticado fue excato al que se dió
            myUserDummyGame.homegoal == UserGame.homegoal && myUserDummyGame.visitorgoal == UserGame.visitorgoal
          )
          {
            UserPlayer.Score += 1;
          }
        }
      }
    })
    UsersPlayers.push(UserPlayer);
  })
  // Ordena de menor a mayor
  UsersPlayers = _.orderBy(UsersPlayers, ['Score'],['desc']);
  // Calcula la posición de jugador actual y la notifica.
  var positionCount = 1;
  var scoresCount = 0;

  // try {
  //   UsersPlayers.forEach(function(UserPlayer) {
  //     // Primer recorrido cuántos puntos lleva el primero si es el usuario abandona el ciclo el usuario actual estaría de primero
  //     if ( scoresCount == 0 ){
  //       scoresCount = UsersPlayers.Score;
  //       if ( UserPlayer.Email == userEmail ){
  //         throw BreakException;
  //       }
  //     }
  //     else{
  //       // El score bajó de anterior posición baja una posición
  //       if ( UsersPlayers.Score < scoresCount ){
  //         positionCount++;
  //         if ( UserPlayer.Email == userEmail ){
  //           throw BreakException;
  //         }
  //       }
  //     }
  //   });
  // } catch (e) {
  // }

  console.log(UsersPlayers);
}

  GetUsersGroups() {

    // Una vez ingresa pasa a buscar todos los grupos donde está el usuario y trae todos los resultados de todos los jugadores

    let mUrl = url + 'api/GetUsersGroups';

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
          this.UsersGroups = res.json().UsersGroups;

          // El primer procesamiento es con la data actual del user actual
          this.processResults(this.UsersGroups, this.User.Email, false );
          // Por cada usuario calcula los resultados basados en todos los resultados faltantes perfectos según su quiniela
          this.UsersGroups.forEach(function(User){
            // Cada juego no terminado lo termina con el resultado igual al pronosticado
            User.DummyGames.forEach(function(usrDummyGame){
              if ( usrDummyGame.IsEnd == false ){
                usrDummyGame.IsEnd = true;
                usrDummyGame.homegoal = User.Games[usrDummyGame.game].homegoal;
                usrDummyGame.visitorgoal = User.Games[usrDummyGame.game].visitorgoal;
              }
            })
            this.processResults(this.UsersGroups, User.Email, true );
          });

        }
        else{
          let alert = this.alertCtrl.create({
            title: 'Oops!',
            subTitle: 'El usuario no existe. Ya te registraste?',
            buttons: ['Ok']
          });
          alert.present();        }
      }
    )

  }

  UpdateUser() {

    let mUrl = url + 'api/UpdateUser';

    this.User.DummyGames.forEach(function(eachGame){

      if (typeof eachGame.homegoal == 'string' && eachGame.homegoal.trim() == '' ){
        eachGame.homegoal = 0;
      }
      if (typeof eachGame.visitorgoal == 'string' && eachGame.visitorgoal.trim() == '' ){
        eachGame.visitorgoal = 0;
      }
    })

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

          // Luego de actualizado los datos busca para calcular resultados
          this.GetUsersGroups();

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
