import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpeakerService } from 'src/app/speaker/speaker.service';
import { Event } from 'src/app/_models/event';
import { Speaker } from 'src/app/_models/speaker';
import { EventService } from '../event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  events: Event[] = [];
  speakers:Speaker[]=[];

  constructor(public EventService: EventService,public SpeakerService :SpeakerService, public Router:Router) { }

  ngOnInit(): void {
    this.EventService.getAllEvents().subscribe(ev => {
      this.events = ev.data;
    },
    error => this.AuthError(error)
    )
    this.SpeakerService.getAllSpeakers().subscribe(sp=>{
      this.speakers = sp.data;
    },
    error => this.AuthError(error)
    )
  }
  Delete(id: number) {
    if(confirm("Are you sure you want to delete this event?")){
      this.EventService.DeleteEvent(id).subscribe(a=>{
        this.EventService.getAllEvents().subscribe(ev => {
          this.events = ev.data;
        },
        error => this.AuthError(error))
      },
      error => this.AuthError(error)
      )
    }
  }

  AuthError(error:any){
    if(error.error.message == 'Error: Not Authenticated'){
      this.Router.navigate(['']);
     }
  }

}
