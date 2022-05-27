import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SpeakerDetailsComponent } from "./speaker-details/speaker-details.component";
import { SpeakerEditComponent } from "./speaker-edit/speaker-edit.component";
import { SpeakerListComponent } from "./speaker-list/speaker-list.component";

const routes: Routes = [
    { path: "", component: SpeakerListComponent , pathMatch: "full"},
    { path: "details/:id", component: SpeakerDetailsComponent },
    { path: "list", redirectTo: "" },
    { path: "edit/:id", component: SpeakerEditComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SpeakerRoutingModule { }