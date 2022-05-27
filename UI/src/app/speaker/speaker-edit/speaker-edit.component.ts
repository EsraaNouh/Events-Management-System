import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { Speaker } from 'src/app/_models/speaker';
import { SpeakerService } from '../speaker.service';

@Component({
  selector: 'app-speaker-edit',
  templateUrl: './speaker-edit.component.html',
  styleUrls: ['./speaker-edit.component.css']
})
export class SpeakerEditComponent implements OnInit {

  id: string = "";
  sp: Speaker = new Speaker("","","","","","",0);
  displayStyle='none';
  confirmPassword="";
  message="";

  constructor(public SpeakerService: SpeakerService, public ActivatedRoute: ActivatedRoute, public Router: Router, public UserService:UserService) { 

  }

  ngOnInit(): void {
    this.ActivatedRoute.params.subscribe(a => {
      this.id = a['id'];
    },
    error => {
      this.AuthError(error);
      this.AnyError(error)
    })
    this.SpeakerService.getSpeaker(this.id).subscribe(sp => {
      this.sp = sp.data[0];
      this.sp.password ="";
    },
    error => {
      this.AuthError(error);
      this.AnyError(error)
    })
  }

  Save() {
    let speaker = {
      _id:this.sp._id,
      email:this.sp.email,
      userName:this.sp.userName,
      address:{
        city:this.sp.address.city,
        street:this.sp.address.street,
        building:this.sp.address.building
      }
    }
    this.SpeakerService.EditSpeaker(speaker).subscribe(sp => {
      console.log(sp);
      if(this.UserService.getUser().role=='admin'){
        let url = this.Router.url.replace('/edit/'+this.id,"");
      this.Router.navigate([url]);
      }
      else{
        this.Router.navigate(['/speaker/details/'+this.id]);
      }
    },
    error => {
      this.AuthError(error);
      this.AnyError(error)
    })
  }

  Back(){
    let url = this.Router.url.replace('/edit/'+this.id,"");
    this.Router.navigate([url]);
  }

  ChangePass(){
    if(this.confirmPassword == this.sp.password){
      this.SpeakerService.EditSpeaker(this.sp).subscribe(sp=>{
        console.log(sp);
        this.displayStyle = 'none';
        this.message = "";
        this.confirmPassword="";
      },
      error => {
        this.AuthError(error);
        this.AnyError(error)
      })
    }
    else
      this.message = "Passwords don't match";
  }

  AuthError(error:any){
    if(error.error.message == 'Error: Not Authenticated'){
      this.Router.navigate(['']);
     }
  }

  AnyError(error: any){
    if(error.error.message != 'Error: Not Authenticated'){
    this.message = error.error.message.split(':')[1];
    this.ngOnInit();
    }
  }

}
