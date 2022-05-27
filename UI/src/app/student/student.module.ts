import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentRegisterComponent } from './student-register/student-register.component';
import { StudentDetailsComponent } from './student-details/student-details.component';
import { StudentEditComponent } from './student-edit/student-edit.component';
import { RouterModule } from '@angular/router';
import { StudentRoutingModule } from './student-routing.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    StudentListComponent,
    StudentRegisterComponent,
    StudentDetailsComponent,
    StudentEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    StudentRoutingModule,
    FormsModule
  ],
  exports:[
    StudentRegisterComponent,
    StudentListComponent
  ]
})
export class StudentModule { }
