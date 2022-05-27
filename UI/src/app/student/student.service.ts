import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Student } from '../_models/student';
import { User } from '../_models/user';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  baseurl = "http://localhost:8080/students/";
  httpOptions = {headers:{}};

  constructor(public http: HttpClient, public UserService: UserService) {

  }
  GetToken() {
    let headers_object = new HttpHeaders().set("Authorization", "Bearer " + this.UserService.getUser().token);
    this.httpOptions = {
      headers: headers_object
    };
  }
  getAllStudents() {
    this.GetToken();
    return this.http.get<any>(this.baseurl, this.httpOptions);
  }
  getStudent(id: Number) {
    this.GetToken();
    return this.http.get<any>(this.baseurl + id, this.httpOptions);
  }

  getStudentEvents(id:number){
    this.GetToken();
    return this.http.get<any>(this.baseurl+"events/"+id, this.httpOptions)
  }

  addStudent(st: Student) {
    this.GetToken();
    return this.http.post(this.baseurl, st, this.httpOptions);
  }

  EditStudent(st: any) {
    this.GetToken();
    return this.http.put(this.baseurl, st, this.httpOptions);
  }

  DeleteStudent(id: Number) {
    this.GetToken();
    let httpOptions = {
      body: { _id:id},
      headers: this.httpOptions.headers
    }
    return this.http.delete(this.baseurl, httpOptions);
  }

}
