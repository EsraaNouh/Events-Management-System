import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpeakerService } from 'src/app/speaker/speaker.service';
import { StudentService } from 'src/app/student/student.service';
import { Event } from 'src/app/_models/event';
import { Speaker } from 'src/app/_models/speaker';
import { Student } from 'src/app/_models/student';
import { EventService } from '../event.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {

  id=0;
  ev: Event = new Event(0,"",new Date(),"",[],[]);
  mainSpeaker: Speaker = new Speaker("","","","","","",0);
  speakers: Speaker[] =[];
  students: Student[] =[];

  constructor(public EventService: EventService,public SpeakerService : SpeakerService,public StudentService : StudentService, public ActivatedRoute: ActivatedRoute,public Router: Router) { }

  ngOnInit(): void {
    this.ActivatedRoute.params.subscribe(a => {
      this.id=a['id'];
      this.EventService.getEvent(a['id']).subscribe(ev => {
        this.ev = ev.data[0];
        this.SpeakerService.getSpeaker(this.ev.mainSpeaker_id).subscribe(s=>{
          console.log(this.ev);
          this.mainSpeaker = s.data[0];
        },error => this.AuthError(error))
        let allspeakers : Speaker[] =[];
        this.SpeakerService.getAllSpeakers().subscribe(s=>{
          allspeakers = s.data;
          allspeakers.forEach(s=>{
            if(this.ev.otherSpeakers_ids.includes(s._id))
              this.speakers.push(s);
            
          })
        },
        error => this.AuthError(error))
        let allstudents : Student[] =[];
        this.StudentService.getAllStudents().subscribe(s=>{
          allstudents = s.data;
          allstudents.forEach(s=>{
            if(this.ev.students_ids.includes(s._id))
              this.students.push(s);
          })
        },
        error => this.AuthError(error))
      },
      error => this.AuthError(error))
    },
    error => this.AuthError(error))
  }

  Back(){
    let url = this.Router.url.replace('/details/'+this.id,"");
    this.Router.navigate([url]);
  }
  AuthError(error:any){
    if(error.error.message == 'Error: Not Authenticated'){
      this.Router.navigate(['']);
     }
  }

}
