import { Injectable } from '@angular/core';
import { User } from './_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User = new User("","","");

  constructor() {
   }

  createUser(user:User){
    this.user = user;
  }
  getUser(){
    return this.user;
  }
  DeleteUser(){
    this.user = new User("","","");
  }
}
