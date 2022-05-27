import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Speaker } from '../_models/speaker';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class SpeakerService {

  baseurl = "http://localhost:8080/speakers/";
  httpOptions = {headers:{}};

  constructor(public http: HttpClient, public UserService: UserService) {
  }
  GetToken() {
    let headers_object = new HttpHeaders().set("Authorization", "Bearer " + this.UserService.getUser().token);
    this.httpOptions = {
      headers: headers_object
    };
  }
  getAllSpeakers() {
    this.GetToken();
    return this.http.get<any>(this.baseurl, this.httpOptions);
  }
  getSpeaker(id: string) {
    this.GetToken();
    return this.http.get<any>(this.baseurl + id, this.httpOptions);
  }

  getSpeakerEvents(id:string){
    this.GetToken();
    return this.http.get<any>(this.baseurl+"events/"+id,this.httpOptions)
  }
  addSpeaker(sp: Speaker) {
    this.GetToken();
    return this.http.post(this.baseurl, sp, this.httpOptions);
  }

  EditSpeaker(sp: any) {
    this.GetToken();
    return this.http.put(this.baseurl, sp, this.httpOptions);
  }

  DeleteSpeaker(id: string) {
    this.GetToken();
    let httpOptions = {
      body: { _id:id},
      headers: this.httpOptions.headers
    }
    return this.http.delete(this.baseurl, httpOptions);
  }

}
