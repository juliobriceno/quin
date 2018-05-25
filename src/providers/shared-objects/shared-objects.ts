import { Injectable } from '@angular/core';

@Injectable()
export class SharedObjectsProvider {
  User: any = {}
  anotherUser: any = {}
  Games: any = {}
  RefreshPostions: boolean = true;

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

}
