import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminHomepageComponent } from "./admin-homepage/admin-homepage.component";

const routes: Routes = [
    {
        path: "home", component: AdminHomepageComponent, children: [
            { path: "student", loadChildren: () => import("./../student/student.module").then(m => m.StudentModule) },
            { path: "speaker", loadChildren: () => import("./../speaker/speaker.module").then(m => m.SpeakerModule) },
            { path: "event", loadChildren: () => import("./../event/event.module").then(m => m.EventModule) }
        ]
    },
    { path: "", redirectTo: "home", pathMatch: "full" }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminRoutingModule { }