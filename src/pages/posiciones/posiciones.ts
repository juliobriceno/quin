import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage, MenuopcionesPage, QuinielagrupoPage } from "../index.paginas";
import { AlertController, LoadingController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { url } from "../../config/url.config"

import { SharedObjectsProvider } from '../../providers/shared-objects/shared-objects';
import { GropByPipe } from '../../pipes/grop-by/grop-by';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { Platform } from 'ionic-angular';

import * as _ from 'lodash';


@IonicPage()
@Component({
  selector: 'page-posiciones',
  templateUrl: 'posiciones.html',
})
export class PosicionesPage {
  User = { Groups: [], Email: '', DummyGames: [] };
  MenuOpciones:any = MenuopcionesPage;
  QuinielaGrupo:any = QuinielagrupoPage;
  selectedGroup:any = {};
  UsersGroups:any = [];
  UsersPlayers = [];
  CurrentUsersPlayers = [];
  endedGames = [{homegoal: 0, visitorgoal: 0, game: ''}];
  msgId = 1;
  constructor(      public navCtrl: NavController, public navParams: NavParams,
                    public http: Http, public alertCtrl: AlertController,
                    public loadingCtrl: LoadingController,
                    public ctrlSharedObjectsProvider:SharedObjectsProvider,
                    public localNotifications: LocalNotifications,
                    public platform: Platform) {
  }

  ionViewWillEnter(){
    this.User = this.ctrlSharedObjectsProvider.getUser();
    if (this.ctrlSharedObjectsProvider.getRefreshPosition() == true){
      this.GetUsersGroups();
    }
  }

  showOtherUserInfo(userEmail){
    var antoherUser = this.UsersGroups.filter(function(eachUser){
      return eachUser.Email == userEmail;
    })[0];
    this.ctrlSharedObjectsProvider.setanotherUser(antoherUser);
    this.navCtrl.push( QuinielagrupoPage );
  }

  groupChange(selectedValue: any) {
    let self = this;
    this.ctrlSharedObjectsProvider.setActualGroup(selectedValue);
    this.CurrentUsersPlayers = this.UsersPlayers.filter(function(UserPlayer){
      return UserPlayer.GroupName == selectedValue.trim() && UserPlayer.BetBy == self.User.Email;
    })
  }

  processResults(pUsers, userEmail, isSimulated){

    var Data = { Users: [] };
    Data.Users = pUsers;
    var self = this;

    // Se calculan las posiciones de todos los grupos donde esté el usuario actual
    this.User.Groups.forEach(function(eachGroup){
      // Por cada grupo busca el tipò de jugada viendo quien es el administrador entre todos los jugadores, por defecto es 1
      // Verifica el tipo de jugada. Se busca al administrador que es el que la tiene)
      var myBetType = 1

      Data.Users.forEach(function (eachUser) {
        eachUser.Groups.forEach(function(userGroup){
          if ( userGroup.Name == eachGroup.Name && userGroup.IsAdmin == true ){
            myBetType = userGroup.BetType;
          }
        })
      })

      // Calcula el tipo de jugada BetType == 1 es que el que pega el ganador o empate gana 1 punto, caso contrario 0 puntos BetType == 2
      // es que el que acierta ganador o empate gana 1 punto (Si además acierta resultado gana 1 punto adicional)
      // Recorre cada usuario del grupo para estimar la cantidad de puntos según el BetType

      // El usuario de donde se sacará el Dummy Game
      var userDummyGame = Data.Users.filter(function(usr){
        return usr.Email == userEmail;
      })[0];

      Data.Users.forEach(function(User){
        var UserPlayer = { Alias: '', Email: '', Score: 0, GroupName: [], BetBy: '' };
        UserPlayer.Alias = User.Alias;
        UserPlayer.Email = User.Email;
        UserPlayer.Score = 0;
        UserPlayer.GroupName = eachGroup.Name;
        UserPlayer.BetBy = userEmail;

        // Recorre todos los pronósticos
        User.Games.forEach(function(UserGame){
          // Por cada pronóstico busca cada resultado si lo acertó y el BetType == 1 (1 punto) si además el BetType == 2 y acertó el resultado 1 punto más. Sólo
          // los juegos que se hayan considerado terminado. Los pronóstico son del usuario que se le pase a ésta función

          var myUserDummyGame = userDummyGame.DummyGames.filter(function(UserDummyGame){
            return UserDummyGame.game == UserGame.game &&
            ((typeof UserDummyGame.homegoal == 'string' && UserDummyGame.homegoal.trim() != '') || (typeof UserDummyGame.homegoal == 'number')) &&
            ((typeof UserDummyGame.visitorgoal == 'string' && UserDummyGame.visitorgoal.trim() != '') || (typeof UserDummyGame.visitorgoal == 'number')) &&
            ((typeof UserGame.homegoal == 'string' && UserGame.homegoal.trim() != '') || (typeof UserGame.homegoal == 'number')) &&
            ((typeof UserGame.visitorgoal == 'string' && UserGame.visitorgoal.trim() != '')  || (typeof UserGame.visitorgoal == 'number'))
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
        self.UsersPlayers.push(UserPlayer);
      })

    })

    this.ctrlSharedObjectsProvider.setRefreshPosition(false);

    // Lee a ver si había un grupo colocado
    let actualGroup = this.ctrlSharedObjectsProvider.getActualGroup();

    if (actualGroup != ''){
      this.groupChange(actualGroup);
    }

  }

    GetUsersGroups() {

      // Si el usuario no está en ningún grupo no hay nada que buscar de posiciones
      if (this.User.Groups.length == 0){
        return 0;
      }

      // Una vez ingresa pasa a buscar todos los grupos donde está el usuario y trae todos los resultados de todos los jugadores

      let mUrl = url + 'api/GetUsersGroups';

      const body = {User: this.User};

      let loading = this.loadingCtrl.create({
        content: 'Working...',
        spinner: 'ios'
      });

      loading.present();

      var self = this;

      this.http
        .post( mUrl, body ).subscribe(res => {
          loading.dismiss();
          if (res.json().result == 'ok' ){
            this.UsersGroups = res.json().UsersGroups;
            this.endedGames = res.json().endedGames;

            // Si viene con juegos simulados pasa a sobre escribir todos los juegos siempre y cuando no venga de simulaciones propio
            var mOwnCal = this.ctrlSharedObjectsProvider.getOwnCalc();
            if (mOwnCal == false){
              // Recorre cada juego simulado si lo consigue entre los juegos ya definidos los marca como están definidos
              // caso contrario los deja 0 a 0 sin finalizar
              this.User.DummyGames.forEach(function(eachUserGame){
                var lendedGame =   [{homegoal: 0, visitorgoal: 0, game: ''}];

                var lendedGame = self.endedGames.filter(function(endedGame){
                  return endedGame.game == eachUserGame.game
                })
                // Si el juego no existe 0 a 0 sin terminar el juego para permitir editar
                if (lendedGame.length == 0){
                  eachUserGame.isEnded = false;
                  eachUserGame.homegoal = undefined;
                  eachUserGame.visitorgoal = undefined;
                }
                // Caso contrario coloca el marcador dque viene y el juego lo coloca cerrado para que no pueda editar
                else{
                  eachUserGame.isEnded = true;
                  eachUserGame.homegoal = lendedGame[0].homegoal;
                  eachUserGame.visitorgoal = lendedGame[0].visitorgoal;
                }
              })
              this.ctrlSharedObjectsProvider.setUser(self.User);
            }


            // El primer procesamiento es con la data actual del user actual
            this.UsersPlayers = [];
            // Por cada usuario calcula los resultados basados en todos los resultados faltantes perfectos según su quiniela
            this.UsersGroups.forEach(function(User){
              // Cada juego no terminado lo termina con el resultado igual al pronosticado
              User.DummyGames.forEach(function(usrDummyGame){
                if (typeof User.Games[usrDummyGame.game] != 'undefined'){
                  usrDummyGame.homegoal = User.Games[usrDummyGame.game].homegoal;
                  usrDummyGame.visitorgoal = User.Games[usrDummyGame.game].visitorgoal;
                }
              })
              self.processResults(self.UsersGroups, User.Email, true );
            });

            this.ShowNotifications();

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

    ShowNotifications(){
      var allUserPlayers = [];
      var self = this;
      let lNotifications = [];

      // Recorre cada uno de los grupos en donde está el usuario actual
      this.User.Groups.forEach(function(eachUserGroup){
        // Por cada grupo del usuario actual primero busca la posición del usuario actual en cada grupo
        // Lo primero es calcular la posición por cada grupo
        var allUserPlayerByGroup = self.UsersPlayers.filter(function(eachUserGroupResult){
          return eachUserGroupResult.GroupName == eachUserGroup.Name;
        })
        // Extrae los diferentes usuarios/calculos de cada grupo de quiniela
        var distinctUser = _.uniqBy(self.UsersPlayers, 'BetBy');

        // Por cada Bet de cada usuario agrupa
        distinctUser.forEach(function(eachBetUser){
          var allUserPlayerByGroupByBet = allUserPlayerByGroup.filter(function(eachUserGroupResultByBet){
            return eachUserGroupResultByBet.BetBy == eachBetUser.BetBy;
          })

          // Por cada grupo, por cada Bet calcula las posiciones
          var mPosition = 0;
          var mScore = 99999;

          allUserPlayerByGroupByBet = _.orderBy(allUserPlayerByGroupByBet, ['Score'], ['desc']);

          allUserPlayerByGroupByBet.forEach(function(eachUserByGroupByBet){
            if (mScore > eachUserByGroupByBet.Score){
              mPosition++;
              eachUserByGroupByBet.Position = mPosition;
              mScore = eachUserByGroupByBet.Score;
            }
            else{
              eachUserByGroupByBet.Position = mPosition;
            }
          })

        })

      })

      // Mensaje con la posición del usuario actual en cada uno de los grupos
      this.UsersPlayers.forEach(function (userPlayer) {
        if (userPlayer.Email == self.User.Email && userPlayer.BetBy == self.User.Email){
          if(self.platform.is('cordova')){
            lNotifications.push({ id: self.msgId, text: 'Estás en la posición: ' + userPlayer.Position, icon: "res://icon.png", smallIcon:"res://icon.png", title: 'Tú posición en grupo: ' + userPlayer.GroupName });
            self.msgId ++;
          }
        }
      })

      // Recorre cada grupo del usuario actual
      this.User.Groups.forEach(function(eachUserGroup){
        // Por cada grupo del usuario actual analiza cada jugador basado en la jugada del jugador actual
        var allUserPlayerByGroupByBet = self.UsersPlayers.filter(function(eachUserGroupResultByBet){
          return eachUserGroupResultByBet.GroupName == eachUserGroup.Name;
        })

        // Agrupa por cada User
        var allDistintUserPlayerByGroupByBet = _.uniqBy(allUserPlayerByGroupByBet, 'Email');

        // Por cada jugador ve su peor posición posible em el grupo actual
        allDistintUserPlayerByGroupByBet.forEach(function(UserInGroup){
          var UserInAllSameGroup = allUserPlayerByGroupByBet.filter(function(eachUserInGroup){
            return eachUserInGroup.Email ==  UserInGroup.Email;
          })
          // La peor posición posible para un User
          UserInAllSameGroup = _.orderBy(UserInAllSameGroup, ['Position'], ['desc']);

          if (UserInAllSameGroup[0].Position == 1){
            self.UsersPlayers.forEach(function(eachUserPlayer){
              if (eachUserPlayer.Email == UserInGroup.Email && eachUserPlayer.GroupName == eachUserGroup.Name){
                eachUserPlayer.Level = 'oro';
                if(self.platform.is('cordova')){
                  lNotifications.push({ id: self.msgId, text: UserInGroup.Alias + ' es campeón!!!', icon: "res://icon.png", smallIcon:"res://icon.png", title: "Campeón del grupo: " + eachUserPlayer.GroupName });
                  self.msgId ++;
                }
              }
            })
          }
          else if (UserInAllSameGroup[0].Position == 2){
            self.UsersPlayers.forEach(function(eachUserPlayer){
              if (eachUserPlayer.Email == UserInGroup.Email && eachUserPlayer.GroupName == eachUserGroup.Name){
                eachUserPlayer.Level = 'plata';
                if(self.platform.is('cordova')){
                  lNotifications.push({ id: self.msgId, text: UserInGroup.Alias + ' asegura medalla de plata!!!', icon: "res://icon.png", smallIcon:"res://icon.png", title: "Aseguró plata del grupo: " + eachUserPlayer.GroupName });
                  self.msgId ++;
                }
              }
            })
          }
          else if (UserInAllSameGroup[0].Position == 3){
            self.UsersPlayers.forEach(function(eachUserPlayer){
              if (eachUserPlayer.Email == UserInGroup.Email && eachUserPlayer.GroupName == eachUserGroup.Name){
                eachUserPlayer.Level = 'bronce';
                if(self.platform.is('cordova')){
                  lNotifications.push({ id: self.msgId, text: UserInGroup.Alias + ' asegura medalla de bronce!!!: ', icon: "res://icon.png", smallIcon:"res://icon.png", title: "Aseguró bronce del grupo: " + eachUserPlayer.GroupName });
                  self.msgId ++;
                }
              }
            })
          }
          else{
            self.UsersPlayers.forEach(function(eachUserPlayer){
              if (eachUserPlayer.Email == UserInGroup.Email && eachUserPlayer.GroupName == eachUserGroup.Name){
                eachUserPlayer.Level = 'handdown';
              }
            })
          }

          self.localNotifications.schedule( lNotifications );

        })


      })

      console.log(self.UsersPlayers);

    }

}
