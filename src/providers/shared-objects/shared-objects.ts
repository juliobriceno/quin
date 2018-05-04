import { Injectable } from '@angular/core';

@Injectable()
export class SharedObjectsProvider {
  User: any = {}

  setUser(value) {
    this.User = value;
  }

  getUser() {
    return this.User;
  }

}
