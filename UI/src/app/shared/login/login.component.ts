import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  userName: string = '';
  password: string = '';
  message = "";

  constructor(public http: HttpClient, public Router: Router, public UserService:UserService) {

  }

  login() {
    let usr = {
      userName: this.userName,
      password: this.password
    }
    this.http.post<any>("http://localhost:8080/login", usr).subscribe(u => {
      let user: User = new User(u.token, u.role, u.id);
      this.UserService.createUser(user);
      if(user.role == "admin"){
        this.Router.navigate(['admin/home']);
      }
      else if(user.role =="student"){
        this.Router.navigate(['student/details/'+user.id]);
      }
      else if(user.role =="speaker"){
        this.Router.navigate(['speaker/details/'+user.id]);
      }
    },
    error=> {
      this.message = "userName and password incorrect";
      this.userName = '';
      this.password = '';
      console.log(error.error.message)}
    )
  }


  ngOnInit(): void {
  }

}
