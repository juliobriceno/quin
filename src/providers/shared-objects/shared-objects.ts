import { Injectable } from '@angular/core';

@Injectable()
export class SharedObjectsProvider {
  User: any = {}
  Games: any = {}

  setUser(value) {
    this.User = value;
  }

  getUser() {
    return this.User;
  }

  setGames(value) {
    this.Games = value;
  }

  getGames() {
    return this.Games;
  }

}
