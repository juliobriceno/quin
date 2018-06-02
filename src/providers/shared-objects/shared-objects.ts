import { Injectable } from '@angular/core';

@Injectable()
export class SharedObjectsProvider {
  User: any = {}
  anotherUser: any = {}
  Games: any = {}
  RefreshPostions: boolean = true;
  ActualGroup = '';
  OwnCalc = true;
  noBet = false;

  setUser(value) {
    this.User = value;
  }

  getUser() {
    return this.User;
  }

  setanotherUser(value) {
    this.anotherUser = value;
  }

  getanotherUser() {
    return this.anotherUser;
  }

  setGames(value) {
    this.Games = value;
  }

  getGames() {
    return this.Games;
  }

  setRefreshPosition(value) {
    this.RefreshPostions = value;
  }

  getRefreshPosition() {
    return this.RefreshPostions;
  }

  setActualGroup(value) {
    this.ActualGroup = value;
  }

  getActualGroup() {
    return this.ActualGroup;
  }

  setOwnCalc(value) {
    this.OwnCalc = value;
  }

  getOwnCalc() {
    return this.OwnCalc;
  }

  setnoBet(value) {
    this.noBet = value;
  }

  getnoBet() {
    return this.noBet;
  }

}
