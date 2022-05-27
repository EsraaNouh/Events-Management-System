import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Student } from 'src/app/_models/student';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  
  students: Student[] = [];

  constructor(public StudentService: StudentService, public Router:Router) { }

  ngOnInit(): void {
    this.StudentService.getAllStudents().subscribe(std => {
      console.log(std);
      this.students = std.data;
    },
    error => this.AuthError(error)
    )
  }

  Delete(id: Number) {
    if(confirm("Are you sure you want to delete this student?")){
      this.StudentService.DeleteStudent(id).subscribe(a=>{
        this.StudentService.getAllStudents().subscribe(std => {
          this.students = std.data;
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
