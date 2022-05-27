import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { Speaker } from 'src/app/_models/speaker';
import { User } from 'src/app/_models/user';
import { SpeakerService } from '../speaker.service';

@Component({
  selector: 'app-speaker-register',
  templateUrl: './speaker-register.component.html',
  styleUrls: ['./speaker-register.component.css']
})
export class SpeakerRegisterComponent implements OnInit {

  speaker : Speaker = new Speaker("","","","","","",0);
  confirmPassword ="";
  message="";

  constructor(public SpeakerService: SpeakerService,public Router:Router, public http: HttpClient, public UserService:UserService) { }

  ngOnInit(): void {
  }
  Register(){
    if(this.confirmPassword != this.speaker.password)
        this.message = "Passwords don't match"
    
    else{
      this.message ="";
      this.SpeakerService.addSpeaker(this.speaker).subscribe(s=>{

        this.http.post<any>("http://localhost:8080/login", { userName: this.speaker.userName, password: this.speaker.password }).subscribe(u => {
          let user: User = new User(u.token, u.role, u.id);
          this.UserService.createUser(user);
          this.Router.navigate(['speaker/details/' + user.id]);

        },
          error => this.AnyError(error))
      },
      error => this.AnyError(error))
    }
  }

  AnyError(error: any){
    if(error.error.message != 'Error: Not Authenticated'){
    this.message = error.error.message.split(':')[1];
    this.ngOnInit();
    }
  }

}
