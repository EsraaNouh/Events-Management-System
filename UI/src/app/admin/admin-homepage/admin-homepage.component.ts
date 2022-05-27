import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-homepage',
  templateUrl: './admin-homepage.component.html',
  styleUrls: ['./admin-homepage.component.css']
})
export class AdminHomepageComponent implements OnInit {

  stdmenu;
  spmenu;
  evmenu;
  constructor() {
    this.stdmenu = false;
    this.spmenu = false;
    this.evmenu = false;
   }

  ngOnInit(): void {
  }
}
