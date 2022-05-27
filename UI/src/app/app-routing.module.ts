import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './Guards/admin.guard';
import { SpeakerGuard } from './Guards/speaker.guard';
import { StudentGuard } from './Guards/student.guard';
import { ErrorComponent } from './shared/error/error.component';
import { LoginComponent } from './shared/login/login.component';
import { SpeakerRegisterComponent } from './speaker/speaker-register/speaker-register.component';
import { StudentRegisterComponent } from './student/student-register/student-register.component';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "student/register", component: StudentRegisterComponent},
  { path: "speaker/register", component: SpeakerRegisterComponent},
  { path: "student", loadChildren: () => import("./student/student.module").then(m => m.StudentModule), canLoad:[StudentGuard] },
  { path: "speaker", loadChildren: () => import("./speaker/speaker.module").then(m => m.SpeakerModule) ,canLoad: [SpeakerGuard]},
  { path: "admin", loadChildren: () => import("./admin/admin.module").then(m => m.AdminModule) ,canLoad:[AdminGuard]},
  { path: "**", component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
