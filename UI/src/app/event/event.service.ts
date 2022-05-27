import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { Event } from '../_models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  baseurl = "http://localhost:8080/events/";
  httpOptions = {headers:{}};

  constructor(public http: HttpClient, public UserService: UserService) { 
  }

  GetToken() {
    let headers_object = new HttpHeaders().set("Authorization", "Bearer " + this.UserService.getUser().token);
    this.httpOptions = {
      headers: headers_object
    };
  }

  getAllEvents() {
    this.GetToken();
    return this.http.get<any>(this.baseurl, this.httpOptions);
  }
  getEvent(id: number) {
    this.GetToken();
    return this.http.get<any>(this.baseurl + id, this.httpOptions);
  }

  addEvent(ev: Event) {
    this.GetToken();
    return this.http.post(this.baseurl, ev, this.httpOptions);
  }

  EditEvent(ev: any) {
    this.GetToken();
    return this.http.put(this.baseurl, ev, this.httpOptions);
  }

  AddSpeakersToEvent(sp: any){
    this.GetToken();
    return this.http.put(this.baseurl+"addspeakers",sp,this.httpOptions);
  }

  AddStudentsToEvent(std:any){
    this.GetToken();
    return this.http.put(this.baseurl+"addstudents",std,this.httpOptions);
  }

  DeleteEvent(id: number) {
    this.GetToken();
    let httpOptions = {
      body: { _id:id},
      headers: this.httpOptions.headers
    }
    return this.http.delete(this.baseurl, httpOptions);
  }
  
}
