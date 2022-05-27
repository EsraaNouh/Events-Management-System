import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { Student } from 'src/app/_models/student';
import { User } from 'src/app/_models/user';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-student-register',
  templateUrl: './student-register.component.html',
  styleUrls: ['./student-register.component.css']
})
export class StudentRegisterComponent implements OnInit {

  std: Student = new Student(0, "", "");
  confirmPassword = "";
  message = ""
  constructor(public StudentService: StudentService, public Router: Router, public http: HttpClient, public UserService: UserService) { }

  ngOnInit(): void {
  }

  Register() {
    if (this.confirmPassword != this.std.password)
      this.message = "Passwords don't match";

    else {
      this.message = "";
      this.StudentService.addStudent(this.std).subscribe(s => {

        this.http.post<any>("http://localhost:8080/login", { userName: this.std.email, password: this.std.password }).subscribe(u => {
          let user: User = new User(u.token, u.role, u.id);
          this.UserService.createUser(user);
          this.Router.navigate(['student/details/' + user.id]);

        },
          error => this.AnyError(error))
      },
        error => this.AnyError(error))
    }
  }

  AnyError(error: any) {
    if (error.error.message != 'Error: Not Authenticated') {
      this.message = error.error.message.split(':')[1];
      this.ngOnInit();
    }
  }

}
