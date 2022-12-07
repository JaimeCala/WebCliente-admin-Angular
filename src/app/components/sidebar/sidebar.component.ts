import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { UtilsService } from 'src/app/service/utils.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit,OnDestroy {
  isAdmin = null;
  isVendedor = null;
  isLogged = false;

  private destroy = new Subject<any>();

  constructor(private authService: AuthService , private utilsService: UtilsService) { }
  links: any=[];
  ngOnInit(): void {
      this.authService.isLogged
              .pipe(takeUntil(this.destroy))
              .subscribe((res)=>(this.isLogged = res))

    this.authService.isAdmin
            .pipe(takeUntil(this.destroy))
            .subscribe((res)=> (this.isAdmin = res));

    this.authService.isVendedor
            .pipe(takeUntil(this.destroy))
            .subscribe((res)=> (this.isVendedor = res));

  }
  

  onExit(){
    this.authService.logout();
    this.utilsService.openSidebar(false);
  }

  ngOnDestroy(): void {
      this.destroy.next({});
      this.destroy.complete();
  }
}
