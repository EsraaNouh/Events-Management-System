import { Component, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/user.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  constructor(public UserService: UserService) {
  }

  ngOnInit(): void {
  }
  LogOut() {
    this.UserService.DeleteUser();
  }

}
