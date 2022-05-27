import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from './../../_models/student';
import { StudentService } from '../student.service';
import { Event } from 'src/app/_models/event';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent implements OnInit {

  id=0;
  std: Student = new Student(0, "", "");
  events : Event[] =[];

  constructor(public StudentService: StudentService, public ActivatedRoute: ActivatedRoute,public Router: Router, public UserService: UserService) { 

  }

  ngOnInit(): void {
    this.ActivatedRoute.params.subscribe(a => {
      this.id = a['id'];
      this.StudentService.getStudent(a['id']).subscribe(std => {
        this.std = std.data[0];
      },
      error => this.AuthError(error));
      this.StudentService.getStudentEvents(a['id']).subscribe(stdev=>{
        this.events = stdev.data;
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
    this.Router.navigate(['student/edit/'+this.id]);
  }

  AuthError(error:any){
    if(error.error.message == 'Error: Not Authenticated'){
      this.Router.navigate(['']);
     }
  }
}
