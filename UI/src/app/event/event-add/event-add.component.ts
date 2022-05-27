import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpeakerService } from 'src/app/speaker/speaker.service';
import { StudentService } from 'src/app/student/student.service';
import { Event } from 'src/app/_models/event';
import { Speaker } from 'src/app/_models/speaker';
import { Student } from 'src/app/_models/student';
import { EventService } from '../event.service';

@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.css']
})
export class EventAddComponent implements OnInit {

  id: number = 0;
  event : Event = new Event(0,"",new Date(),"",[],[]);
  allSpeakers: Speaker[] = [];
  allStudents: Student[] = [];
  date: string | null = "";
  message="";
  
  constructor(public EventService: EventService, public StudentService: StudentService,public SpeakerService: SpeakerService,public datepipe: DatePipe, public Router:Router) { 
    this.date = this.datepipe.transform(this.event.event_date, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.StudentService.getAllStudents().subscribe(s=>{
      this.allStudents = s.data;
    },
    error => {
      this.AuthError(error);
      this.AnyError(error)
    }
    );
    this.SpeakerService.getAllSpeakers().subscribe(s=>{
      this.allSpeakers = s.data;
    },
    error => {
      this.AuthError(error);
      this.AnyError(error)
    });
  }
  Add(){
    this.event.event_date = new Date(this.date?? "");
    this.EventService.addEvent(this.event).subscribe(a=>{
      let url = this.Router.url.replace('/add',"");
      this.Router.navigate([url]);
    },
    error => {
      this.AuthError(error);
      this.AnyError(error)
    })
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
