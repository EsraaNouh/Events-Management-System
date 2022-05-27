import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpeakerListComponent } from './speaker-list/speaker-list.component';
import { SpeakerDetailsComponent } from './speaker-details/speaker-details.component';
import { SpeakerRegisterComponent } from './speaker-register/speaker-register.component';
import { SpeakerEditComponent } from './speaker-edit/speaker-edit.component';
import { SpeakerRoutingModule } from './speaker-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SpeakerListComponent,
    SpeakerDetailsComponent,
    SpeakerRegisterComponent,
    SpeakerEditComponent
  ],
  imports: [
    CommonModule,
    SpeakerRoutingModule,
    RouterModule,
    FormsModule
  ],
  exports:[
    SpeakerRegisterComponent
  ]
})
export class SpeakerModule { }
