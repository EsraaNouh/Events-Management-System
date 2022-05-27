import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from './../../_models/student';
import { StudentService } from '../student.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.css']
})
export class StudentEditComponent implements OnInit {

  id: Number = 0;
  std: Student = new Student(0, "", "");
  displayStyle='none';
  confirmPassword="";
  message="";

  constructor(public StudentService: StudentService, public ActivatedRoute: ActivatedRoute, public Router: Router, public UserService: UserService) {

   }

  ngOnInit(): void {
    this.ActivatedRoute.params.subscribe(a => {
      this.id = a['id'];
    },
    error => {
      this.AuthError(error);
      this.AnyError(error)
    })
    this.StudentService.getStudent(this.id).subscribe(std => {
      this.std = std.data[0];
      this.std.password ="";
    },
    error => {
      this.AuthError(error);
      this.AnyError(error)
    })
  }

  Save() {
    //we will send only email and id => if a student want to change password it would be another action
    this.StudentService.EditStudent({_id:this.std._id, email:this.std.email}).subscribe(std => {
      console.log(std);
      if(this.UserService.getUser().role=='admin'){
        let url = this.Router.url.replace('/edit/'+this.id,"");
        this.Router.navigate([url]);
      }
      else{
        this.Router.navigate(['/student/details/'+this.id]);
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
    if(this.confirmPassword == this.std.password){
      this.StudentService.EditStudent(this.std).subscribe(std=>{
        console.log(std);
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
