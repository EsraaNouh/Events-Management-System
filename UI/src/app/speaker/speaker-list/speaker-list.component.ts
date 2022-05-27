import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Speaker } from 'src/app/_models/speaker';
import { SpeakerService } from '../speaker.service';

@Component({
  selector: 'app-speaker-list',
  templateUrl: './speaker-list.component.html',
  styleUrls: ['./speaker-list.component.css']
})
export class SpeakerListComponent implements OnInit {

  speakers: Speaker[] = [];

  constructor(public SpeakerService: SpeakerService,public Router:Router) { }

  ngOnInit(): void {
    this.SpeakerService.getAllSpeakers().subscribe(sp => {
      this.speakers = sp.data;
    },
    error => this.AuthError(error)
      
    )
  }

  Delete(id: string) {
    if(confirm("Are you sure you want to delete this speaker?")){
      this.SpeakerService.DeleteSpeaker(id).subscribe(a=>{
        this.SpeakerService.getAllSpeakers().subscribe(sp => {
          this.speakers = sp.data;
        },
        error => this.AuthError(error)
        )
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
