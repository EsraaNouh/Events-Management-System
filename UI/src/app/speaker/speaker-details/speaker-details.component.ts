import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { Event } from 'src/app/_models/event';
import { Speaker } from 'src/app/_models/speaker';
import { SpeakerService } from '../speaker.service';

@Component({
  selector: 'app-speaker-details',
  templateUrl: './speaker-details.component.html',
  styleUrls: ['./speaker-details.component.css']
})
export class SpeakerDetailsComponent implements OnInit {

  id=0;
  sp: Speaker = new Speaker("", "", "","","","",0);
  events:Event[] =[];

  constructor(public SpeakerService: SpeakerService, public ActivatedRoute: ActivatedRoute,public Router: Router, public UserService:UserService) { 

  }

  ngOnInit(): void {
    this.ActivatedRoute.params.subscribe(a => {
      this.id = a['id'];
      this.SpeakerService.getSpeaker(a['id']).subscribe(sp => {
        this.sp = sp.data[0];
      },
      error => this.AuthError(error));
      this.SpeakerService.getSpeakerEvents(a['id']).subscribe(spev=>{
        this.events = spev.events;
        console.log(spev);
      },
      error => this.AuthError(error))
    },
    error => this.AuthError(error))
  }

  Back(){
    let url = this.Router.url.replace('/details/'+this.id,"");
    this.Router.navigate([url]);
  }

  Edit(){
    this.Router.navigate(['speaker/edit/'+this.id]);
  }

  AuthError(error:any){
    if(error.error.message == 'Error: Not Authenticated'){
      this.Router.navigate(['']);
     }
  }

}
