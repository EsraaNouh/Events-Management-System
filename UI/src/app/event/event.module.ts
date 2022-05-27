import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EventListComponent } from './event-list/event-list.component';
import { EventAddComponent } from './event-add/event-add.component';
import { EventEditComponent } from './event-edit/event-edit.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { EventRoutingModule } from './event-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    EventListComponent,
    EventAddComponent,
    EventEditComponent,
    EventDetailsComponent
  ],
  imports: [
    CommonModule,
    EventRoutingModule,
    RouterModule,
    FormsModule
  ],
  providers:[
    DatePipe
  ]
})
export class EventModule { }
