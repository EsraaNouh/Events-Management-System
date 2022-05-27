import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpeakerService } from 'src/app/speaker/speaker.service';
import { StudentService } from 'src/app/student/student.service';
import { Event } from 'src/app/_models/event';
import { Speaker } from 'src/app/_models/speaker';
import { Student } from 'src/app/_models/student';
import { EventService } from '../event.service';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {

  id: number = 0;
  ev: Event = new Event(0, "", new Date(), "", [], []);
  allSpeakers: Speaker[] = [];
  allStudents: Student[] = [];
  speakers: Speaker[] = [];
  students: Student[] = [];
  date: string | null = "";
  message="";

  displayStyleAddSp = "none";
  displayStyleChngSp = "none";
  displayStyleAddStd = "none";
  displayStyleChngStd = "none";

  Sparray: string[] = [];
  Stdarray: number[] = [];

  constructor(public EventService: EventService, public SpeakerService: SpeakerService, public StudentService: StudentService, public ActivatedRoute: ActivatedRoute, public Router: Router, public datepipe: DatePipe) { }


  ngOnInit(): void {
    this.ActivatedRoute.params.subscribe(a => {
      this.id = a['id'];
    },
    error => this.AuthError(error));
    this.EventService.getEvent(this.id).subscribe(ev => {
      this.ev = ev.data[0];
      this.date = this.datepipe.transform(this.ev.event_date, 'yyyy-MM-dd');

      this.SpeakerService.getAllSpeakers().subscribe(s => {
        this.allSpeakers = s.data;
        this.allSpeakers.forEach(s => {
          if (this.ev.otherSpeakers_ids.includes(s._id))
            this.speakers.push(s);
        })
      },
      error => {
        this.AuthError(error);
        this.AnyError(error)
      });
      this.StudentService.getAllStudents().subscribe(s => {
        this.allStudents = s.data;
        this.allStudents.forEach(s => {
          if (this.ev.students_ids.includes(s._id))
            this.students.push(s);
        })
      },
      error => {
        this.AuthError(error);
        this.AnyError(error)
      })
    },
    error => {
      this.AuthError(error);
      this.AnyError(error)
    });
  }

  Save() {
    this.ev.event_date = new Date(this.date?? "");
    console.log(this.ev.event_date);
    this.EventService.EditEvent(this.ev).subscribe(ev => {
      let url = this.Router.url.replace('/edit/'+this.id,"");
      this.Router.navigate([url]);
      console.log(ev);
    },
    error => {
      this.AuthError(error);
      this.AnyError(error)
    })
  }
  AddSpeakers() {
    this.EventService.AddSpeakersToEvent({ _id: this.id, speakers_ids: this.Sparray }).subscribe(s => {
      this.ev.otherSpeakers_ids.push(...this.Sparray);
      this.ev.otherSpeakers_ids = [...new Set(this.ev.otherSpeakers_ids)];
      this.Sparray = [];
      this.speakers = [];
      this.allSpeakers.forEach(s => {
        if (this.ev.otherSpeakers_ids.includes(s._id))
          this.speakers.push(s);
      })
    },
    error => {
      this.AuthError(error);
      this.AnyError(error)
    })
  }
  ChangeSpeakers() {
    this.EventService.EditEvent({ _id: this.id, otherSpeakers_ids: this.Sparray }).subscribe(s => {
      this.ev.otherSpeakers_ids = this.Sparray;
      this.Sparray = [];
      this.speakers = [];
      this.allSpeakers.forEach(s => {
        if (this.ev.otherSpeakers_ids.includes(s._id))
          this.speakers.push(s);
      })
    },
    error => {
      this.AuthError(error);
      this.AnyError(error)
    })

  }
  AddStudents() {
    this.EventService.AddStudentsToEvent({ _id: this.id, students_ids: this.Stdarray }).subscribe(s => {
      this.ev.students_ids.push(...this.Stdarray.map(n=>{return parseInt(n.toString())}));
      this.ev.students_ids = [...new Set(this.ev.students_ids)];
      this.Stdarray = [];
      this.students = [];
      this.allStudents.forEach(s => {
        if (this.ev.students_ids.includes(s._id))
          this.students.push(s);
      })
    },
    error => {
      this.AuthError(error);
      this.AnyError(error)
    })
  }
  ChangeStudents() {
    this.EventService.EditEvent({ _id: this.id, students_ids: this.Stdarray }).subscribe(s => {
      this.ev.students_ids = this.Stdarray.map(n=>{return parseInt(n.toString())});
      console.log(this.ev.students_ids)
      this.Stdarray = [];
      this.students = [];
      this.allStudents.forEach(s => {
        if (this.ev.students_ids.includes(s._id))
          this.students.push(s);
      })
    },
    error => {
      this.AuthError(error);
      this.AnyError(error)
    })
  }
  Back() {
    let url = this.Router.url.replace('/edit/'+this.id,"");
    this.Router.navigate([url]);
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
