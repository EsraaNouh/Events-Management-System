import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StudentDetailsComponent } from "./student-details/student-details.component";
import { StudentEditComponent } from "./student-edit/student-edit.component";
import { StudentListComponent } from "./student-list/student-list.component";

const routes: Routes = [
    { path: "", component: StudentListComponent , pathMatch: "full"},
    { path: "details/:id", component: StudentDetailsComponent },
    { path: "list", redirectTo: "" },
    { path: "edit/:id", component: StudentEditComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class StudentRoutingModule { }