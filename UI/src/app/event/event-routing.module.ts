import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EventAddComponent } from "./event-add/event-add.component";
import { EventDetailsComponent } from "./event-details/event-details.component";
import { EventEditComponent } from "./event-edit/event-edit.component";
import { EventListComponent } from "./event-list/event-list.component";

const routes: Routes = [
    { path: "", component: EventListComponent , pathMatch: "full" },
    { path: "details/:id", component: EventDetailsComponent },
    { path: "list", redirectTo: ""},
    { path: "add", component: EventAddComponent },
    { path: "edit/:id", component: EventEditComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class EventRoutingModule { }