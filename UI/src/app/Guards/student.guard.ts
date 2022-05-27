import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class StudentGuard implements CanLoad {
  
  constructor(public UserService:UserService,public Router:Router) {
    
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.UserService.getUser().role == 'student')
      return true;
    else{
      this.Router.navigate(['']);
      return false;
    }
  }
}
