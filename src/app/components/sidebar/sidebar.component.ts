import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { UtilsService } from 'src/app/service/utils.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private authService: AuthService , private utilsService: UtilsService) { }

  ngOnInit(): void {
  }

  onExit(){
    this.authService.logout();
    this.utilsService.openSidebar(false);
  }

}
